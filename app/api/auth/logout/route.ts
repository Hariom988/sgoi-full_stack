import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { USER_SESSION_COOKIE_NAME, destroyUserSession } from "@/lib/auth/userSession";
import {
  validateCsrfTokens,
  csrfCookieName,
  csrfHeaderName,
} from "@/lib/auth/csrf";

function getJwtSecret(): Uint8Array {
  const secret = process.env.USER_JWT_SECRET;
  if (!secret) throw new Error("USER_JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
}

function buildClearCookieHeader(path: string, secure: boolean): string {
  const parts = [
    `${USER_SESSION_COOKIE_NAME}=`,
    `Max-Age=0`,
    `Path=${path}`,
    `HttpOnly`,
    `SameSite=Strict`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieCsrf = request.cookies.get(csrfCookieName())?.value;
    const headerCsrf = request.headers.get(csrfHeaderName()) ?? undefined;

    if (!validateCsrfTokens(cookieCsrf, headerCsrf)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token." },
        { status: 403 },
      );
    }

    const sessionJwt = request.cookies.get(USER_SESSION_COOKIE_NAME)?.value;

    if (sessionJwt) {
      try {
        const { payload } = await jwtVerify(sessionJwt, getJwtSecret());
        const sessionId = payload.sessionId as string | undefined;
        if (sessionId) {
          await destroyUserSession(sessionId);
        }
      } catch {
        // Already invalid/expired — nothing to clean up server-side.
      }
    }

    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ success: true });

    response.headers.append("Set-Cookie", buildClearCookieHeader("/", secure));

    return response;
  } catch (err) {
    console.error("[User Logout Error]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
