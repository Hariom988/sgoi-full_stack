import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE_NAME, destroySession } from "@/lib/auth/session";
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

function buildClearCookieHeader(path: string, secure: boolean): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
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
    // ── 1. CSRF validation ─────────────────────────────────────────────────────
    const cookieCsrf = request.cookies.get(csrfCookieName())?.value;
    const headerCsrf = request.headers.get(csrfHeaderName()) ?? undefined;

    if (!validateCsrfTokens(cookieCsrf, headerCsrf)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token." },
        { status: 403 },
      );
    }

    // ── 2. Destroy server-side session if JWT is present ──────────────────────
    const sessionJwt = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (sessionJwt) {
      try {
        const { payload } = await jwtVerify(sessionJwt, getJwtSecret());
        const sessionId = payload.sessionId as string | undefined;
        if (sessionId) {
          await destroySession(sessionId);
        }
      } catch {
        // JWT already invalid — still clear cookies below
      }
    }

    // ── 3. Clear cookie on BOTH paths ─────────────────────────────────────────
    // Cookies are keyed by name + path. We clear both "/" and "/admin" to handle
    // cookies issued before and after the path migration, so no stale token survives.
    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ success: true });

    response.headers.append(
      "Set-Cookie",
      buildClearCookieHeader("/", secure),
    );
    response.headers.append(
      "Set-Cookie",
      buildClearCookieHeader("/admin", secure),
    );

    return response;
  } catch (err) {
    console.error("[Admin Logout Error]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}