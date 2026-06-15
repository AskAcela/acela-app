import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const guestId = req.cookies.get("guestId")?.value;
  if (!guestId) {
    return NextResponse.json({ migrated: false, reason: "no_guest_cookie" });
  }

  const [authUser, guestUser] = await Promise.all([
    User.findOne({ email: session.user.email }),
    User.findOne({ guestId }),
  ]);

  if (!authUser) {
    return NextResponse.json({ error: "Authenticated user not found" }, { status: 404 });
  }

  if (!guestUser) {
    // Cookie exists but no guest doc — just clear the cookie
    const res = NextResponse.json({ migrated: false, reason: "no_guest_doc" });
    res.cookies.set("guestId", "", { maxAge: 0, path: "/" });
    return res;
  }

  const dbSession = await mongoose.startSession();
  try {
    await dbSession.withTransaction(async () => {
      // Re-parent conversations from guestId → authenticated userId
      await Conversation.updateMany(
        { guestId },
        { $set: { userId: authUser._id, guestId: null } },
        { session: dbSession }
      );

      // Re-parent messages from guest userId → authenticated userId
      await Message.updateMany(
        { userId: guestUser._id },
        { $set: { userId: authUser._id } },
        { session: dbSession }
      );

      // Delete the guest user doc
      await User.deleteOne({ _id: guestUser._id }, { session: dbSession });
    });
  } finally {
    dbSession.endSession();
  }

  const res = NextResponse.json({ migrated: true });
  res.cookies.set("guestId", "", { maxAge: 0, path: "/" });
  return res;
}
