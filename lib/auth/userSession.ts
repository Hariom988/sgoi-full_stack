import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import UserSession, { IUserSession } from "@/lib/models/UserSession";
import User from "@/lib/models/User";
import { Types } from "mongoose";

const INACTIVITY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const USER_SESSION_COOKIE_NAME = "user_session";

function getJwtSecret(): Uint8Array {
  const secret = process.env.USER_JWT_SECRET;
  if (!secret) throw new Error("USER_JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
}

export interface UserSessionPayload {
  sessionId: string;
}

export interface ValidUserSession {
  sessionId: string;
  userId: string;
  session: IUserSession;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export async function createUserSession(
  userId: Types.ObjectId,
  userAgent: string,
  ipAddress: string,
): Promise<string> {
  await connectDB();

  const sessionToken = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + INACTIVITY_LIMIT_MS);

  await UserSession.create({
    userId,
    sessionToken,
    lastActivityAt: now,
    expiresAt,
    userAgent,
    ipAddress,
  });

  const jwt = await new SignJWT({ sessionId: sessionToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  return jwt;
}

export async function validateAndRefreshUserSession(
  jwt: string,
): Promise<ValidUserSession | null> {
  try {
    const { payload } = await jwtVerify(jwt, getJwtSecret());
    const sessionId = payload.sessionId as string | undefined;

    if (!sessionId || typeof sessionId !== "string") return null;

    await connectDB();
    const session = await UserSession.findOne({ sessionToken: sessionId });

    if (!session) return null;

    const user = await User.findById(session.userId)
      .select("name email avatarUrl")
      .lean();

    if (!user) return null;

    const now = new Date();
    const msSinceLastActivity =
      now.getTime() - session.lastActivityAt.getTime();

    if (msSinceLastActivity > INACTIVITY_LIMIT_MS) {
      await UserSession.deleteOne({ _id: session._id });
      return null;
    }

    const newExpiresAt = new Date(now.getTime() + INACTIVITY_LIMIT_MS);
    await UserSession.updateOne(
      { _id: session._id },
      { lastActivityAt: now, expiresAt: newExpiresAt },
    );

    return {
      sessionId,
      userId: session.userId.toString(),
      name: (user as { name?: string }).name ?? "",
      email: (user as { email?: string }).email ?? "",
      avatarUrl: (user as { avatarUrl?: string | null }).avatarUrl ?? null,
      session,
    };
  } catch {
    return null;
  }
}

export async function destroyUserSession(sessionToken: string): Promise<void> {
  await connectDB();
  await UserSession.deleteOne({ sessionToken });
}

export function userSessionCookieOptions(maxAgeSeconds = 7 * 24 * 60 * 60) {
  return {
    name: USER_SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
