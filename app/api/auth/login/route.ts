import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { createUserSession, userSessionCookieOptions } from "@/lib/auth/userSession";
import {
  validateCsrfTokens,
  csrfCookieName,
  csrfHeaderName,
} from "@/lib/auth/csrf";

const INVALID_CREDENTIALS_MSG = "Invalid email or password.";
const DUMMY_HASH =
  "$2b$12$invalidhashpaddingtopreventimenumeration00000000000000000";

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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as Record<string, unknown>).email !== "string" ||
      typeof (body as Record<string, unknown>).password !== "string"
    ) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { email, password } = body as { email: string; password: string };
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail || !password) {
      return NextResponse.json(
        { error: INVALID_CREDENTIALS_MSG },
        { status: 401 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email: sanitizedEmail }).select(
      "+passwordHash",
    );

    if (!user || !user.passwordHash) {
      // Run a dummy compare so response timing doesn't reveal whether the
      // account exists, or whether it's a Google-only account.
      await verifyPassword(password, DUMMY_HASH);
      return NextResponse.json(
        { error: INVALID_CREDENTIALS_MSG },
        { status: 401 },
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: INVALID_CREDENTIALS_MSG },
        { status: 401 },
      );
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const jwt = await createUserSession(user._id, userAgent, ipAddress);

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      ...userSessionCookieOptions(),
      value: jwt,
    });
    return response;
  } catch (err) {
    console.error("[User Login Error]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
