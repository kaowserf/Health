import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

// Single shared admin password (PRD: admin panel is for one client). The
// password itself is never stored in the cookie — we store a signed token so
// it can't be tampered with. Configure via env: ADMIN_PASSWORD + a random
// ADMIN_SESSION_SECRET (see .env.example).

const COOKIE_NAME = "hwl_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set.");
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Verify a submitted password against ADMIN_PASSWORD (constant-time). */
export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set.");
  return safeEqual(submitted, expected);
}

/** Build a tamper-proof session token: "<expiry>.<hmac>". */
function makeToken(): string {
  const exp = String(Math.floor(nowSeconds()) + SESSION_TTL_SECONDS);
  return `${exp}.${sign(exp)}`;
}

function nowSeconds(): number {
  // Date.now is fine in route handlers / server actions (request-time only).
  return Date.now() / 1000;
}

function tokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac) return false;
  if (!safeEqual(mac, sign(exp))) return false;
  return Number(exp) > nowSeconds();
}

/** Set the admin session cookie. Call from a Server Action / Route Handler. */
export async function startAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return tokenValid(store.get(COOKIE_NAME)?.value);
}

/** Redirect to the login page unless the request carries a valid session. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
