import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await connectDB();

  const session = await auth();

  let userDoc: typeof User.prototype | null = null;

  if (session?.user?.email) {
    userDoc = await User.findOne({ email: session.user.email }).lean();
  } else {
    const guestId = req.cookies.get("guestId")?.value;
    if (guestId) {
      userDoc = await User.findOne({ guestId }).lean();
    }
  }

  if (!userDoc) {
    return NextResponse.json({ creditsRemaining: 0, creditsSpentTotal: 0, creditsPurchasedTotal: 0, plan: "guest_free" });
  }

  return NextResponse.json({
    creditsRemaining: userDoc.creditsRemaining ?? 0,
    creditsSpentTotal: userDoc.creditsSpentTotal ?? 0,
    creditsPurchasedTotal: userDoc.creditsPurchasedTotal ?? 0,
    plan: userDoc.plan ?? "guest_free",
  });
}
