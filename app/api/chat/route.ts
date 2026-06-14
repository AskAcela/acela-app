import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import {
  estimateTokensFromMessages,
  tokensToCredits,
  initialCreditsForAuthenticated,
  initialCreditsForGuest,
} from "@/lib/credits";

import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

import type { ChatRequestBody, AgentResponseShape } from "@/types";
import {
  getAgentReply,
  getTotalTokens,
  safeParseAgentResponse,
} from "@/lib/agent";


export async function POST(req: NextRequest) {
  await connectDB();

  const body = (await req.json().catch(() => null)) as ChatRequestBody | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const conversationId = body.conversationId?.trim();

  const latestUserMessage = body.message?.trim();

  if (!latestUserMessage) {
    return NextResponse.json(
      { error: "A user message is required" },
      { status: 400 }
    );
  }

  const session = await auth();

  let userDoc = null as typeof User.prototype | null;
  let guestId: string | null = null;
  let shouldSetGuestCookie = false;

  if (session?.user?.email) {
    userDoc = await User.findOne({ email: session.user.email });

    if (!userDoc) {
      userDoc = await User.create({
        name: session.user.name ?? null,
        email: session.user.email,
        image: session.user.image ?? null,
        isGuest: false,
        plan: "authenticated_free",
        creditsRemaining: initialCreditsForAuthenticated(),
        creditsSpentTotal: 0,
        creditsPurchasedTotal: 0,
        lastSeenAt: new Date(),
      });
    } else {
      // Backfill if needed
      if (!userDoc.plan) userDoc.plan = "authenticated_free";
      if (typeof userDoc.creditsRemaining !== "number") {
        userDoc.creditsRemaining = initialCreditsForAuthenticated();
      }
      userDoc.lastSeenAt = new Date();
      await userDoc.save();
    }
  } else {
    guestId = req.cookies.get("guestId")?.value ?? crypto.randomUUID();
    shouldSetGuestCookie = !req.cookies.get("guestId")?.value;

    userDoc = await User.findOne({ guestId });

    if (!userDoc) {
      userDoc = await User.create({
        guestId,
        isGuest: true,
        plan: "guest_free",
        creditsRemaining: initialCreditsForGuest(),
        creditsSpentTotal: 0,
        creditsPurchasedTotal: 0,
        lastSeenAt: new Date(),
      });
    } else {
      if (!userDoc.plan) userDoc.plan = "guest_free";
      if (typeof userDoc.creditsRemaining !== "number") {
        userDoc.creditsRemaining = initialCreditsForGuest();
      }
      userDoc.lastSeenAt = new Date();
      await userDoc.save();
    }
  }

  const ownerQuery = session?.user?.email
    ? { userId: userDoc._id }
    : { guestId };

  let conversation = null as typeof Conversation.prototype | null;

  if (conversationId) {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversationId" },
        { status: 400 }
      );
    }

    conversation = await Conversation.findOne({
      _id: conversationId,
      ...ownerQuery,
    });
  }

  if (!conversation) {
    // check if conversation exist with id, but not user owned
    const existingConversation = await Conversation.findOne({
      _id: conversationId,
    });
    if (existingConversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
    const title = latestUserMessage.slice(0, 60) || "New conversation";

    conversation = await Conversation.create({
      ...ownerQuery,
      title,
      messageCount: 0,
      tokensUsedTotal: 0,
      creditsChargedTotal: 0,
      archived: false,
      lastMessageAt: new Date(),
    });
  }

  const previousMessages = await Message.find({
    conversationId: conversation._id,
  })
    .sort({ createdAt: 1 })
    .lean();

  const agentMessages = [
    ...previousMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user" as const, content: latestUserMessage },
  ];

  const estimatedTokens = estimateTokensFromMessages(agentMessages);
  const estimatedCredits = tokensToCredits(Math.ceil(estimatedTokens * 1.2));

  if (userDoc.creditsRemaining < estimatedCredits) {
    return NextResponse.json(
      {
        error: "Insufficient credits",
        creditsRemaining: userDoc.creditsRemaining,
        estimatedCredits,
      },
      { status: 402 }
    );
  }

  const agentUrl = process.env.AGENT_URL;
  const chatEndpoint = `${agentUrl}/chat?mode=${body.mode ?? "ask"}`;

  if (!agentUrl) {
    return NextResponse.json(
      { error: "AGENT_URL is not configured" },
      { status: 500 }
    );
  }

  const agentRes = await fetch(chatEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: agentMessages,
    }),
    cache: "no-store",
  });

  if (!agentRes.ok) {
    const errorText = await agentRes.text().catch(() => "");
    return NextResponse.json(
      {
        error: "Agent request failed",
        details: errorText || `Agent returned ${agentRes.status}`,
      },
      { status: 502 }
    );
  }

  const agentPayload = await safeParseAgentResponse(agentRes);
  const assistantText = getAgentReply(agentPayload);

  if (!assistantText.trim()) {
    return NextResponse.json(
      { error: "Agent returned an empty response" },
      { status: 502 }
    );
  }

  const totalTokensUsed = getTotalTokens(agentPayload, assistantText);
  const creditsCharged = tokensToCredits(totalTokensUsed);

  const dbSession = await mongoose.startSession();

  try {
    await dbSession.withTransaction(async () => {
      const currentUser = await User.findById(userDoc._id).session(dbSession);

      if (!currentUser) {
        throw new Error("USER_NOT_FOUND");
      }

      if (currentUser.creditsRemaining < creditsCharged) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      await Message.create(
        [
          {
            conversationId: conversation._id,
            userId: currentUser._id,
            role: "user",
            content: latestUserMessage,
            tokenCount: estimateTokensFromMessages([{ content: latestUserMessage }]),
            creditsCharged: 0,
            metadata: { source: "client" },
          },
          {
            conversationId: conversation._id,
            userId: currentUser._id,
            role: "assistant",
            content: assistantText,
            tokenCount: totalTokensUsed,
            creditsCharged,
            metadata: {
              source: "agent",
            },
          },
        ],
        { session: dbSession }
      );

      await User.updateOne(
        { _id: currentUser._id },
        {
          $inc: {
            creditsRemaining: -creditsCharged,
            creditsSpentTotal: creditsCharged,
          },
          $set: {
            lastSeenAt: new Date(),
          },
        },
        { session: dbSession }
      );

      await Conversation.updateOne(
        { _id: conversation._id },
        {
          $inc: {
            messageCount: 2,
            tokensUsedTotal: totalTokensUsed,
            creditsChargedTotal: creditsCharged,
          },
          $set: {
            lastMessageAt: new Date(),
          },
        },
        { session: dbSession }
      );
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to persist chat";

    if (message === "INSUFFICIENT_CREDITS") {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          creditsRemaining: userDoc.creditsRemaining,
          creditsCharged,
        },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    );
  } finally {
    dbSession.endSession();
  }

  const response = NextResponse.json(
    {
      conversationId: conversation._id.toString(),
      reply: assistantText,
      creditsRemaining: userDoc.creditsRemaining - creditsCharged,
      creditsCharged,
      tokensUsed: totalTokensUsed,
      plan: userDoc.plan,
    },
    { status: 200 }
  );

  if (shouldSetGuestCookie && guestId) {
    response.cookies.set("guestId", guestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}