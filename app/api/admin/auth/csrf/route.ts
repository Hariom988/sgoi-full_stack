import { NextRequest, NextResponse } from "next/server";
import { generateCsrfToken, isValidCsrfToken, csrfCookieName } from "@/lib/auth/csrf";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Reuse an existing valid token instead of always minting a new one.
  // Keeps the cookie and any in-flight client requests in sync when multiple
  // GETs land close together (Strict Mode's double-effect invocation in dev,
  // multiple tabs, client retries, etc.).
  const existingToken = request.cookies.get(csrfCookieName())?.value;
  const token = isValidCsrfToken(existingToken) ? existingToken : generateCsrfToken();

  const response = NextResponse.json({ csrfToken: token });

  response.cookies.set({
    name: csrfCookieName(),
    value: token,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });

  return response;
}