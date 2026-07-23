import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildGoogleAuthUrl, GOOGLE_OAUTH_STATE_COOKIE } from "@/lib/auth/google";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const state = randomBytes(32).toString("hex");
    const authUrl = buildGoogleAuthUrl(state);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set({
      name: GOOGLE_OAUTH_STATE_COOKIE,
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  } catch (err) {
    console.error("[Google OAuth Init Error]", err);
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("mode", "login");
    loginUrl.searchParams.set("error", "google_unavailable");
    return NextResponse.redirect(loginUrl);
  }
}
