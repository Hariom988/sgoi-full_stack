import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import AdminSession, { IAdminSession } from "@/lib/models/AdminSession";
import { Types } from "mongoose";

// ─── Constants ────────────────────────────────────────────────────────────────

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1 hour in milliseconds
export const SESSION_COOKIE_NAME = "admin_session";

// ─── JWT Secret ───────────────────────────────────────────────────────────────

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionPayload {
  sessionId: string; // Only the DB session ID is stored in the JWT — nothing sensitive
}

export interface ValidSession {
  sessionId: string;
  adminId: string;
  session: IAdminSession;
}

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Creates a new server-side session in MongoDB and returns a signed JWT
 * containing only the session ID (not credentials or role data).
 */
export async function createSession(
  adminId: Types.ObjectId,
  userAgent: string,
  ipAddress: string,
): Promise<string> {
  await connectDB();

  const sessionToken = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + INACTIVITY_LIMIT_MS);

  await AdminSession.create({
    adminId,
    sessionToken,
    lastActivityAt: now,
    expiresAt,
    userAgent,
    ipAddress,
  });

  // JWT payload contains ONLY the sessionToken — no email, no role
  const jwt = await new SignJWT({ sessionId: sessionToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // JWT hard expiry (safety net on top of DB inactivity check)
    .sign(getJwtSecret());

  return jwt;
}

// ─── Validate ─────────────────────────────────────────────────────────────────

/**
 * Validates a JWT from the session cookie.
 * 1. Verifies JWT signature
 * 2. Looks up the session in MongoDB
 * 3. Checks inactivity window
 * 4. Refreshes lastActivityAt if valid
 *
 * Returns ValidSession on success, null on any failure.
 */
export async function validateAndRefreshSession(
  jwt: string,
): Promise<ValidSession | null> {
  try {
    // Step 1 — Verify JWT signature and expiry
    const { payload } = await jwtVerify(jwt, getJwtSecret());
    const sessionId = payload.sessionId as string | undefined;

    if (!sessionId || typeof sessionId !== "string") return null;

    // Step 2 — Look up session in DB
    await connectDB();
    const session = await AdminSession.findOne({ sessionToken: sessionId });

    if (!session) return null;

    // Step 3 — Check inactivity window
    const now = new Date();
    const msSinceLastActivity =
      now.getTime() - session.lastActivityAt.getTime();

    if (msSinceLastActivity > INACTIVITY_LIMIT_MS) {
      // Session expired due to inactivity — clean up and reject
      await AdminSession.deleteOne({ _id: session._id });
      return null;
    }

    // Step 4 — Refresh lastActivityAt and expiresAt (sliding window)
    const newExpiresAt = new Date(now.getTime() + INACTIVITY_LIMIT_MS);
    await AdminSession.updateOne(
      { _id: session._id },
      { lastActivityAt: now, expiresAt: newExpiresAt },
    );

    return {
      sessionId,
      adminId: session.adminId.toString(),
      session,
    };
  } catch {
    // JWT verification failure, DB error, etc.
    return null;
  }
}

// ─── Destroy ──────────────────────────────────────────────────────────────────

/**
 * Deletes a session from MongoDB by its token.
 * Called on logout.
 */
export async function destroySession(sessionToken: string): Promise<void> {
  await connectDB();
  await AdminSession.deleteOne({ sessionToken });
}

// ─── Cookie Options ───────────────────────────────────────────────────────────

/**
 * Returns the standard cookie options for the session cookie.
 * Used when setting the cookie on login.
 */
export function sessionCookieOptions(maxAgeSeconds = 7200) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,           // Not accessible via JS
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict" as const, // No cross-site sending
    path: "/admin",           // Only sent on /admin routes
    maxAge: maxAgeSeconds,
  };
}