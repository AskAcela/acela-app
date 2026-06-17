import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import { auth } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    await connectDB();

    const { conversationId } = await params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return NextResponse.json({ error: "Invalid conversationId" }, { status: 400 });
    }

    const session = await auth();

    let ownerQuery: Record<string, unknown> | null = null;

    if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email }).lean();
        if (!user) return NextResponse.json({ messages: [] });
        ownerQuery = { userId: user._id };
    } else {
        const guestId = req.cookies.get("guestId")?.value;
        if (!guestId) return NextResponse.json({ messages: [] });
        ownerQuery = { guestId };
    }

    const conversation = await Conversation.findOne({
        _id: conversationId,
        ...ownerQuery,
    }).lean();

    if (!conversation) {
        return NextResponse.json({ messages: [] }, { status: 404 });
    }

    const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .lean();

    return NextResponse.json({
        messages: messages.map((m) => ({
            _id: String(m._id),
            conversationId: String(m.conversationId),
            role: m.role,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
            tokenCount: m.tokenCount ?? 0,
            creditsCharged: m.creditsCharged ?? 0,
        })),
        ideaSummary: conversation.ideaSummary ?? null,
    });
}