import { randomBytes } from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_BYTE_LENGTH = 32;

/**
 * Generates a cryptographically random CSRF token.
 */
export function generateCsrfToken(): string {
  return randomBytes(TOKEN_BYTE_LENGTH).toString("hex");
}

/**
 * Checks that a token looks like one we actually issued (right length/charset).
 * Used to decide whether an existing cookie value is safe to re-issue as-is,
 * rather than blindly trusting any client-supplied value.
 */
export function isValidCsrfToken(token: string | undefined): token is string {
  return !!token && new RegExp(`^[a-f0-9]{${TOKEN_BYTE_LENGTH * 2}}$`).test(token);
}

/**
 * Returns the cookie name used for CSRF tokens.
 * The frontend reads this cookie (it is NOT HttpOnly) and
 * re-sends the value in the x-csrf-token request header.
 */
export function csrfCookieName(): string {
  return CSRF_COOKIE_NAME;
}

/**
 * Returns the header name the client must send the CSRF token in.
 */
export function csrfHeaderName(): string {
  return CSRF_HEADER_NAME;
}

/**
 * Validates a CSRF token from a request.
 * Compares the value in the cookie against the value in the header.
 * Both must be present and identical.
 */
export function validateCsrfTokens(
  cookieToken: string | undefined,
  headerToken: string | undefined,
): boolean {
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;

  // Constant-time comparison to prevent timing attacks
  const cookieBuf = Buffer.from(cookieToken);
  const headerBuf = Buffer.from(headerToken);

  if (cookieBuf.length !== headerBuf.length) return false;

  let mismatch = 0;
  for (let i = 0; i < cookieBuf.length; i++) {
    mismatch |= cookieBuf[i] ^ headerBuf[i];
  }

  return mismatch === 0;
}