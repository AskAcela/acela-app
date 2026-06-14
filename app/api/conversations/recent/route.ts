import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import {auth} from "@/lib/auth";

function encodeCursor(item: { lastMessageAt: Date; id: string }) {
  return Buffer.from(
    JSON.stringify({
      lastMessageAt: item.lastMessageAt.toISOString(),
      id: item.id,
    })
  ).toString("base64");
}

function decodeCursor(cursor: string): { lastMessageAt: Date; id: string } | null {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    if (!parsed?.lastMessageAt || !parsed?.id) return null;
    return {
      lastMessageAt: new Date(parsed.lastMessageAt),
      id: parsed.id,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  const session = await auth();
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 20), 50);
  const cursor = req.nextUrl.searchParams.get("cursor");

  let userQuery: Record<string, unknown> | null = null;

  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ items: [], nextCursor: null });
    }
    userQuery = { userId: user._id };
  } else {
    const guestId = req.cookies.get("guestId")?.value;
    if (!guestId) {
      return NextResponse.json({ items: [], nextCursor: null });
    }
    userQuery = { guestId };
  }

  const query: Record<string, unknown> = { ...userQuery };

  if (cursor) {
    const decoded = decodeCursor(cursor);
    if (decoded) {
      query.$or = [
        { lastMessageAt: { $lt: decoded.lastMessageAt } },
        {
          lastMessageAt: decoded.lastMessageAt,
          _id: { $lt: new mongoose.Types.ObjectId(decoded.id) },
        },
      ];
    }
  }

  const docs = await Conversation.find(query)
    .sort({ lastMessageAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = docs.length > limit;
  const page = hasMore ? docs.slice(0, limit) : docs;

  const items = page.map((doc) => ({
    id: String(doc._id),
    title: doc.title,
    updatedAt: doc.updatedAt?.toISOString?.() ?? null,
    lastMessageAt: doc.lastMessageAt?.toISOString?.() ?? null,
  }));

  const nextCursor =
    hasMore && page.length > 0
      ? encodeCursor({
          lastMessageAt: new Date(page[page.length - 1].lastMessageAt),
          id: String(page[page.length - 1]._id),
        })
      : null;

  return NextResponse.json({ items, nextCursor });
}