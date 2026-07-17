import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "admin_session";
const USER_SESSION_COOKIE_NAME = "user_session";

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
}

function getUserJwtSecret(): Uint8Array {
  const secret = process.env.USER_JWT_SECRET;
  if (!secret) throw new Error("USER_JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
}

async function handleUserAuthPages(request: NextRequest): Promise<NextResponse> {
  const sessionJwt = request.cookies.get(USER_SESSION_COOKIE_NAME)?.value;

  if (!sessionJwt) {
    return NextResponse.next();
  }

  try {
    await jwtVerify(sessionJwt, getUserJwtSecret());
    return NextResponse.redirect(new URL("/", request.url));
  } catch {
    const response = NextResponse.next();
    response.cookies.delete(USER_SESSION_COOKIE_NAME);
    return response;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login" || pathname === "/register") {
    return handleUserAuthPages(request);
  }

  const isLoginPage = pathname === "/admin/login";
  const isCsrfEndpoint = pathname === "/api/admin/auth/csrf";
  const isLoginEndpoint = pathname === "/api/admin/auth/login";
  const isLogoutEndpoint = pathname === "/api/admin/auth/logout"; 

  if (isCsrfEndpoint || isLoginEndpoint || isLogoutEndpoint) { 
    return NextResponse.next();
  }

  const sessionJwt = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionJwt) {
    if (isLoginPage) return NextResponse.next();
    return redirectToLogin(request);
  }

  try {
    await jwtVerify(sessionJwt, getJwtSecret());
  } catch {
    const response = redirectToLogin(request);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login", "/register"],
}; 