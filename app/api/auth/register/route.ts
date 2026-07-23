import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth/password";
import { createUserSession, userSessionCookieOptions } from "@/lib/auth/userSession";
import {
  validateCsrfTokens,
  csrfCookieName,
  csrfHeaderName,
} from "@/lib/auth/csrf";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

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

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { name, email, password, confirmPassword } = body as Record<
      string,
      unknown
    >;

    const fields: Record<string, string> = {};

    const sanitizedName = typeof name === "string" ? name.trim() : "";
    const sanitizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const sanitizedPassword = typeof password === "string" ? password : "";
    const sanitizedConfirmPassword =
      typeof confirmPassword === "string" ? confirmPassword : "";

    if (!sanitizedName) fields.name = "Full name is required.";
    if (!sanitizedEmail || !EMAIL_REGEX.test(sanitizedEmail)) {
      fields.email = "Enter a valid email address.";
    }
    if (!sanitizedPassword || sanitizedPassword.length < MIN_PASSWORD_LENGTH) {
      fields.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (sanitizedConfirmPassword !== sanitizedPassword) {
      fields.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(fields).length > 0) {
      return NextResponse.json(
        { error: "Validation failed.", fields },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: sanitizedEmail }).lean();
    if (existing) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          fields: { email: "An account with this email already exists." },
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(sanitizedPassword);

    let user;
    try {
      user = await User.create({
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash,
        authProvider: "credentials",
      });
    } catch (createErr) {
      const isDuplicateKey =
        typeof createErr === "object" &&
        createErr !== null &&
        "code" in createErr &&
        (createErr as { code?: number }).code === 11000;

      if (isDuplicateKey) {
        return NextResponse.json(
          {
            error: "Validation failed.",
            fields: { email: "An account with this email already exists." },
          },
          { status: 409 },
        );
      }
      throw createErr;
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const jwt = await createUserSession(user._id, userAgent, ipAddress);

    const response = NextResponse.json({ success: true }, { status: 201 });
    response.cookies.set({
      ...userSessionCookieOptions(),
      value: jwt,
    });
    return response;
  } catch (err) {
    console.error("[User Register Error]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
