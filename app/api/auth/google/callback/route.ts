import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { createUserSession, userSessionCookieOptions } from "@/lib/auth/userSession";
import {
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  GOOGLE_OAUTH_STATE_COOKIE,
} from "@/lib/auth/google";

function redirectWithError(request: NextRequest, error: string): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", error);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      return redirectWithError(request, "google_denied");
    }

    const expectedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

    if (!code || !state || !expectedState || state !== expectedState) {
      return redirectWithError(request, "google_invalid_state");
    }

    const tokens = await exchangeGoogleCode(code);
    const googleUser = await fetchGoogleUserInfo(tokens.access_token);

    if (!googleUser.email || !googleUser.email_verified) {
      return redirectWithError(request, "google_unverified_email");
    }

    const sanitizedEmail = googleUser.email.trim().toLowerCase();

    await connectDB();

    let user = await User.findOne({
      $or: [{ googleId: googleUser.sub }, { email: sanitizedEmail }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleUser.sub;
        if (user.authProvider === "credentials" && !user.name) {
          user.name = googleUser.name;
        }
        await user.save();
      }
    } else {
      user = await User.create({
        name: googleUser.name || sanitizedEmail.split("@")[0],
        email: sanitizedEmail,
        authProvider: "google",
        googleId: googleUser.sub,
      });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const jwt = await createUserSession(user._id, userAgent, ipAddress);

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set({
      ...userSessionCookieOptions(),
      value: jwt,
    });
    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);

    return response;
  } catch (err) {
    console.error("[Google OAuth Callback Error]", err);
    return redirectWithError(request, "google_failed");
  }
}
