import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect("https://t.me/+szDqEcFcKMEyMTk8", { status: 302 });
}
