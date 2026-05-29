import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  SESSION_COOKIE_NAME,
  destroySession,
} from "@/lib/auth/session";
import {
  validateCsrfTokens,
  csrfCookieName,
  csrfHeaderName,
} from "@/lib/auth/csrf";

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. CSRF validation ─────────────────────────────────────────────────────
    const cookieCsrf = request.cookies.get(csrfCookieName())?.value;
    const headerCsrf = request.headers.get(csrfHeaderName()) ?? undefined;

    if (!validateCsrfTokens(cookieCsrf, headerCsrf)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token." },
        { status: 403 },
      );
    }

    // ── 2. Retrieve and verify session JWT ────────────────────────────────────
    const sessionJwt = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (sessionJwt) {
      try {
        const { payload } = await jwtVerify(sessionJwt, getJwtSecret());
        const sessionId = payload.sessionId as string | undefined;

        if (sessionId) {
          await destroySession(sessionId);
        }
      } catch {
        // JWT already invalid — still clear the cookie below
      }
    }

    // ── 3. Clear session cookie ────────────────────────────────────────────────
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/admin",
      maxAge: 0, // Immediately expire
    });

    return response;
  } catch (err) {
    console.error("[Admin Logout Error]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}