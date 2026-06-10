import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const COOKIE = "admin_token";
const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function signToken(payload: AdminSession): string {
  return jwt.sign(payload, SECRET, { expiresIn: MAX_AGE });
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.verify(token, SECRET) as AdminSession & { exp: number };
    return { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role };
  } catch {
    return null;
  }
}

export async function setSessionCookie(session: AdminSession) {
  const store = await cookies();
  store.set(COOKIE, signToken(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Read + verify the current admin session (server components / route handlers). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Verify email/password against the DB. */
export async function authenticate(
  email: string,
  password: string
): Promise<AdminSession | null> {
  const bcrypt = (await import("bcryptjs")).default;
  const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
