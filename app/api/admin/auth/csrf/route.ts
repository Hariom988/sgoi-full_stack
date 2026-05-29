import { NextResponse } from "next/server";
import { generateCsrfToken, csrfCookieName } from "@/lib/auth/csrf";
export async function GET(): Promise<NextResponse> {
  const token = generateCsrfToken();

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