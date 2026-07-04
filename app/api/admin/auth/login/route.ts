import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Admin from "@/lib/models/admin";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, sessionCookieOptions } from "@/lib/auth/session";
import {
  validateCsrfTokens,
  csrfCookieName,
  csrfHeaderName,
} from "@/lib/auth/csrf";

const INVALID_CREDENTIALS_MSG = "Invalid email or password.";

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
    const admin = await Admin.findOne({ email: sanitizedEmail }).select(
      "+passwordHash",
    );

    if (!admin) {
      await verifyPassword(password, "$2b$12$invalidhashpaddingtopreventimenumeration00000000000000000");
      return NextResponse.json(
        { error: INVALID_CREDENTIALS_MSG },
        { status: 401 },
      );
    }

    const passwordValid = await verifyPassword(password, admin.passwordHash);

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

    const jwt = await createSession(admin._id, userAgent, ipAddress);
       const response = NextResponse.json({ success: true });
    const cookieOptions = sessionCookieOptions();
    response.cookies.set({
      ...cookieOptions,
      value: jwt,
    });
    return response;
  } catch (err) {
    console.error("[Admin Login Error]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}