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
  let isNewConversation = false;
  // Pre-generate an ObjectId so we can reference it inside the transaction
  // before Conversation.create runs (which is now inside the transaction).
  const newConvObjectId = new mongoose.Types.ObjectId();

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

    if (!conversation) {
      // Conversation exists but belongs to someone else → 404.
      const existingConversation = await Conversation.findOne({ _id: conversationId });
      if (existingConversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
      // Provided ID doesn't exist at all — treat as a new conversation.
      isNewConversation = true;
    }
  } else {
    isNewConversation = true;
  }

  // The effective conversation ID — used for loading history and in the transaction.
  const effectiveConvId = conversation?._id ?? newConvObjectId;
  const conversationTitle = latestUserMessage.slice(0, 60) || "New conversation";

  const previousMessages = await Message.find({
    conversationId: effectiveConvId,
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

  const isIdeaMode = body.mode === "idea";
  const isFreeAuth = userDoc.plan === "authenticated_free";

  // Idea mode is authenticated-only — block guests at the API level too
  if (isIdeaMode && userDoc.isGuest) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Free authenticated users get exactly one idea session at no cost.
  // Guard: when starting a NEW idea conversation, count existing ones in the DB.
  // This is robust — it doesn't depend on a flag being written correctly.
  const freeIdeaSession = isIdeaMode && isFreeAuth;

  if (isIdeaMode && isFreeAuth && isNewConversation) {
    const existingIdeaCount = await Conversation.countDocuments({
      userId: userDoc._id,
      mode: "idea",
    });
    if (existingIdeaCount >= 1) {
      return NextResponse.json(
        { error: "Insufficient credits", creditsRemaining: userDoc.creditsRemaining },
        { status: 402 }
      );
    }
  }

  const estimatedTokens = estimateTokensFromMessages(agentMessages);
  const estimatedCredits = tokensToCredits(Math.ceil(estimatedTokens * 1.2));

  // Skip the credit pre-flight for free idea sessions
  if (!freeIdeaSession && userDoc.creditsRemaining < estimatedCredits) {
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
  const chatEndpoint = `${agentUrl}/chat?mode=${body.mode ?? "ask"}&conversation_id=${effectiveConvId.toString()}`;

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

      // Create the conversation inside the transaction so that if anything
      // below fails (messages, user debit) the conversation is rolled back too,
      // leaving no orphaned empty conversations in the database.
      if (isNewConversation) {
        await Conversation.create(
          [
            {
              _id: effectiveConvId,
              ...ownerQuery,
              title: conversationTitle,
              mode: body.mode ?? "ask",
              messageCount: 0,
              tokensUsedTotal: 0,
              creditsChargedTotal: 0,
              archived: false,
              lastMessageAt: new Date(),
            },
          ],
          { session: dbSession }
        );
      }

      await Message.create(
        [
          {
            conversationId: effectiveConvId,
            userId: currentUser._id,
            role: "user",
            content: latestUserMessage,
            tokenCount: estimateTokensFromMessages([{ content: latestUserMessage }]),
            creditsCharged: 0,
            metadata: { source: "client" },
          },
          {
            conversationId: effectiveConvId,
            userId: currentUser._id,
            role: "assistant",
            content: assistantText,
            tokenCount: totalTokensUsed,
            creditsCharged,
            metadata: { source: "agent" },
          },
        ],
        { session: dbSession, ordered: true }
      );

      if (freeIdeaSession) {
        // No credit deduction. Mark the session as consumed only on the
        // first message (new conversation) so subsequent messages in the
        // same session aren't blocked on the next request.
        await User.updateOne(
          { _id: currentUser._id },
          {
            $set: {
              lastSeenAt: new Date(),
            },
          },
          { session: dbSession }
        );
      } else {
        const newCreditsRemaining = Math.max(0, currentUser.creditsRemaining - creditsCharged);
        await User.updateOne(
          { _id: currentUser._id },
          {
            $set: { creditsRemaining: newCreditsRemaining, lastSeenAt: new Date() },
            $inc: { creditsSpentTotal: creditsCharged },
          },
          { session: dbSession }
        );
      }

      await Conversation.updateOne(
        { _id: effectiveConvId },
        {
          $inc: {
            messageCount: 2,
            tokensUsedTotal: totalTokensUsed,
            creditsChargedTotal: creditsCharged,
          },
          $set: { lastMessageAt: new Date() },
        },
        { session: dbSession }
      );
    });
  } catch (error) {
    console.error("Error during transaction:", error);
    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    );
  } finally {
    dbSession.endSession();
  }

  const actualCreditsCharged = freeIdeaSession ? 0 : creditsCharged;
  const response = NextResponse.json(
    {
      conversationId: effectiveConvId.toString(),
      reply: assistantText,
      creditsRemaining: freeIdeaSession
        ? userDoc.creditsRemaining
        : Math.max(0, userDoc.creditsRemaining - creditsCharged),
      creditsCharged: actualCreditsCharged,
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