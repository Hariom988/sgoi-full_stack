import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import AdminSession, { IAdminSession } from "@/lib/models/AdminSession";
import Admin from "@/lib/models/admin";
import { Types } from "mongoose";


const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; 
export const SESSION_COOKIE_NAME = "admin_session";


function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined.");
  return new TextEncoder().encode(secret);
}


export interface SessionPayload {
  sessionId: string;
}

export interface ValidSession {
  sessionId: string;
  adminId: string;
  session: IAdminSession;
  email:string;
}

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
  const jwt = await new SignJWT({ sessionId: sessionToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") 
    .sign(getJwtSecret());

  return jwt;
}

export async function validateAndRefreshSession(
  jwt: string,
): Promise<ValidSession | null> {
  try {
        const { payload } = await jwtVerify(jwt, getJwtSecret());
    const sessionId = payload.sessionId as string | undefined;

    if (!sessionId || typeof sessionId !== "string") return null;

    await connectDB();
const session = await AdminSession.findOne({ sessionToken: sessionId });

if (!session) return null;

const admin = await Admin.findById(session.adminId).select("email").lean();
const email = (admin as { email?: string } | null)?.email ?? "admin@sgoi.in";

    // Step 3 — Check inactivity window
    const now = new Date();
    const msSinceLastActivity =
      now.getTime() - session.lastActivityAt.getTime();

    if (msSinceLastActivity > INACTIVITY_LIMIT_MS) {
      await AdminSession.deleteOne({ _id: session._id });
      return null;
    }

    const newExpiresAt = new Date(now.getTime() + INACTIVITY_LIMIT_MS);
    await AdminSession.updateOne(
      { _id: session._id },
      { lastActivityAt: now, expiresAt: newExpiresAt },
    );

    return {
      sessionId,
      adminId: session.adminId.toString(),
      email,
      session,
    };
  } catch {
    return null;
  }
}


export async function destroySession(sessionToken: string): Promise<void> {
  await connectDB();
  await AdminSession.deleteOne({ sessionToken });
}


export function sessionCookieOptions(maxAgeSeconds = 7200) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,          
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict" as const, 
    path: "/",        
    maxAge: maxAgeSeconds,
  };
}