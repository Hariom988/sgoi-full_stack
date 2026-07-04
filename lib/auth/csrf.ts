import { randomBytes } from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_BYTE_LENGTH = 32;

export function generateCsrfToken(): string {
  return randomBytes(TOKEN_BYTE_LENGTH).toString("hex");
}

export function isValidCsrfToken(token: string | undefined): token is string {
  return !!token && new RegExp(`^[a-f0-9]{${TOKEN_BYTE_LENGTH * 2}}$`).test(token);
}

export function csrfCookieName(): string {
  return CSRF_COOKIE_NAME;
}

export function csrfHeaderName(): string {
  return CSRF_HEADER_NAME;
}


export function validateCsrfTokens(
  cookieToken: string | undefined,
  headerToken: string | undefined,
): boolean {
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;

  const cookieBuf = Buffer.from(cookieToken);
  const headerBuf = Buffer.from(headerToken);

  if (cookieBuf.length !== headerBuf.length) return false;

  let mismatch = 0;
  for (let i = 0; i < cookieBuf.length; i++) {
    mismatch |= cookieBuf[i] ^ headerBuf[i];
  }

  return mismatch === 0;
}