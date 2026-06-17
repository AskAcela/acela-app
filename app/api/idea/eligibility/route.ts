import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Conversation from "@/models/Conversation";

export async function GET() {
  await connectDB();

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ eligible: false, reason: "auth_required" });
  }

  const userDoc = await User.findOne({ email: session.user.email }).lean();
  if (!userDoc) {
    return NextResponse.json({ eligible: false, reason: "auth_required" });
  }

  // Free plan: count how many idea conversations already exist.
  // This is the same check the route uses — no flag to go out of sync.
  if (userDoc.plan === "authenticated_free") {
    const ideaCount = await Conversation.countDocuments({
      userId: userDoc._id,
      mode: "idea",
    });
    if (ideaCount >= 1) {
      return NextResponse.json({ eligible: false, reason: "session_used" });
    }
    return NextResponse.json({ eligible: true });
  }

  // Paid plan: must have credits remaining
  if (userDoc.creditsRemaining <= 0) {
    return NextResponse.json({ eligible: false, reason: "no_credits" });
  }

  return NextResponse.json({ eligible: true });
}
