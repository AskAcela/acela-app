import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json().catch(() => null);
  const conversationId = body?.conversationId?.trim();

  if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
    return NextResponse.json({ error: "Invalid conversationId" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const userDoc = await User.findOne({ email: session.user.email });
  if (!userDoc) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId: userDoc._id,
  });
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Load the full message history for the agent
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();

  const agentMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));

  const agentUrl = process.env.AGENT_URL;
  if (!agentUrl) {
    return NextResponse.json({ error: "AGENT_URL not configured" }, { status: 500 });
  }

  const agentRes = await fetch(`${agentUrl}/idea/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: agentMessages }),
    cache: "no-store",
  });

  if (!agentRes.ok) {
    const detail = await agentRes.text().catch(() => "");
    return NextResponse.json(
      { error: "Failed to generate summary", details: detail },
      { status: 502 }
    );
  }

  const data = (await agentRes.json()) as {
    summary: string;
    usage: { total_tokens: number };
  };

  // Persist summary to the conversation so it loads on revisit
  await Conversation.updateOne(
    { _id: conversationId },
    { $set: { ideaSummary: data.summary, lastMessageAt: new Date() } }
  );

  return NextResponse.json({
    summary: data.summary,
    tokensUsed: data.usage?.total_tokens ?? 0,
  });
}
