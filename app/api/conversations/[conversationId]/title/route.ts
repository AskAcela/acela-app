import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  await connectDB();

  const { conversationId } = await params;
  const body = await req.json().catch(() => null) as { message?: string } | null;
  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const agentUrl = process.env.AGENT_URL;
  if (!agentUrl) {
    return NextResponse.json({ error: "AGENT_URL is not configured" }, { status: 500 });
  }

  // Resolve the owner so we can scope the conversation lookup.
  const session = await auth();
  let ownerQuery: Record<string, unknown>;

  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    ownerQuery = { userId: user._id };
  } else {
    const guestId = req.cookies.get("guestId")?.value;
    if (!guestId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    ownerQuery = { guestId };
  }

  const conversation = await Conversation.findOne({ _id: conversationId, ...ownerQuery });
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const titleRes = await fetch(`${agentUrl}/title`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    cache: "no-store",
  });

  if (!titleRes.ok) {
    return NextResponse.json({ error: "Failed to generate title" }, { status: 502 });
  }

  const { title } = await titleRes.json() as { title: string };
  if (!title?.trim()) {
    return NextResponse.json({ error: "Agent returned empty title" }, { status: 502 });
  }

  conversation.title = title.trim();
  await conversation.save();

  return NextResponse.json({ title: conversation.title });
}
