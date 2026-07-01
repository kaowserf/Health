import { NextResponse } from "next/server";
import { registrationSchema, normalizePhone } from "@/lib/schema";
import { SESSIONS } from "@/lib/seminar";
import { insertRegistration, isSupabaseConfigured } from "@/lib/supabase";

// Naive in-memory rate limit (per warm serverless instance). For production,
// back this with Upstash/Redis or rely on the CRM's own throttling.
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Re-validate server-side — never trust the client (PRD §7.2 step 3).
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check your details and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot tripped — pretend success so bots don't learn (PRD §6.2).
  if (data.botField) {
    return NextResponse.json({ ok: true });
  }

  // TODO(integration): verify CAPTCHA token here (Turnstile / reCAPTCHA v3).

  const session = SESSIONS.find((s) => s.id === data.session);
  const registration = {
    fullName: data.fullName,
    phone: normalizePhone(data.phone),
    email: data.email.toLowerCase(),
    guests: data.guests,
    sessionId: data.session,
    sessionLabel: session?.label ?? data.session,
    interests: data.interests,
    comments: data.comments,
    consent: data.consent,
    receivedAt: new Date().toISOString(),
  };

  try {
    await persistRegistration(registration);
    await sendConfirmationEmail(registration);
  } catch (err) {
    console.error("[register] downstream error", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't complete your registration." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

type Registration = {
  fullName: string;
  phone: string;
  email: string;
  guests: number;
  sessionId: string;
  sessionLabel: string;
  interests: string[];
  comments: string;
  consent: boolean;
  receivedAt: string;
};

// ---------------------------------------------------------------------------
// Integration points (PRD §7.3 / §7.4). These are stubs until the client
// confirms the destination CRM/email tool and provides credentials.
// ---------------------------------------------------------------------------

async function persistRegistration(reg: Registration): Promise<void> {
  // Store every registration in Supabase so it shows up in the /admin panel.
  if (isSupabaseConfigured()) {
    await insertRegistration({
      full_name: reg.fullName,
      phone: reg.phone,
      email: reg.email,
      guests: reg.guests,
      session_id: reg.sessionId,
      session_label: reg.sessionLabel,
      interests: reg.interests,
      comments: reg.comments,
      consent: reg.consent,
    });
    return;
  }

  // Not configured yet (e.g. local dev without keys) — log so registrations
  // aren't silently lost. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to
  // enable persistence (see .env.example).
  console.warn("[register] Supabase not configured; registration not stored", reg);
}

async function sendConfirmationEmail(reg: Registration): Promise<void> {
  // Trigger transactional confirmation via Resend/SendGrid/Postmark, or let
  // the CRM workflow handle it. Include session date/time, location, phone,
  // an .ics calendar attachment, and the disclosure footer (PRD §7.4).
  //
  //   const apiKey = process.env.RESEND_API_KEY;
  //   if (apiKey) { /* send email */ }

  console.info("[register] confirmation email queued for", reg.email);
}
