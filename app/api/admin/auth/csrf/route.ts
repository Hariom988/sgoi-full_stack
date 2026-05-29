import { NextResponse } from "next/server";
import { generateCsrfToken, csrfCookieName } from "@/lib/auth/csrf";

/**
 * GET /api/admin/auth/csrf
 *
 * Issues a CSRF token as a readable (non-HttpOnly) cookie.
 * The login page fetches this on mount and stores the token
 * to send back in the x-csrf-token header on form submission.
 */
export async function GET(): Promise<NextResponse> {
  const token = generateCsrfToken();

  const response = NextResponse.json({ csrfToken: token });

  response.cookies.set({
    name: csrfCookieName(),
    value: token,
    httpOnly: false,    
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 15,
  });

  return response;
}