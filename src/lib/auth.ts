import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { db } from "./db";

const COOKIE_NAME = "evg_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  email: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "Credenciales inválidas" };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return {
      success: false,
      error: "Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta de nuevo más tarde.",
    };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    const failedLoginAttempts = user.failedLoginAttempts + 1;
    const lockedUntil =
      failedLoginAttempts >= MAX_FAILED_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_DURATION_MS)
        : null;
    await db.adminUser.update({
      where: { id: user.id },
      data: { failedLoginAttempts, lockedUntil },
    });
    return { success: false, error: "Credenciales inválidas" };
  }

  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await db.adminUser.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  await createSession({ sub: String(user.id), email: user.email });
  return { success: true };
}

export async function logout() {
  await destroySession();
}

const RESET_TOKEN_DURATION_MS = 60 * 60 * 1000; // 1 hour

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Always returns a token so the caller sends a generic "check your email"
// message regardless of whether the address matched — never leaks account
// existence to the requester.
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  await db.adminUser.update({
    where: { id: user.id },
    data: {
      resetTokenHash: hashResetToken(token),
      resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_DURATION_MS),
    },
  });

  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<boolean> {
  const user = await db.adminUser.findUnique({
    where: { resetTokenHash: hashResetToken(token) },
  });
  return Boolean(user && user.resetTokenExpiresAt && user.resetTokenExpiresAt > new Date());
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const user = await db.adminUser.findUnique({
    where: { resetTokenHash: hashResetToken(token) },
  });

  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt <= new Date()) {
    return { success: false, error: "El enlace ha expirado o no es válido. Solicita uno nuevo." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.adminUser.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  return { success: true };
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await verifySession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
