import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth/session";

export async function POST() {
  try {
    await removeSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
