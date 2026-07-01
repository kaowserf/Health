import "server-only";

// Thin Supabase (PostgREST) data layer. We talk to Supabase over its REST API
// with the SERVICE ROLE key so this only ever runs server-side — never import
// this from a Client Component. Using REST means no extra npm dependency.

// Trim to survive a stray space/newline pasted into the env var (a common
// hosting-dashboard gotcha that otherwise yields "Invalid API key").
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const TABLE = "registrations";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
}

function restUrl(path: string): string {
  if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not set.");
  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${path}`;
}

function headers(extra?: Record<string, string>): HeadersInit {
  if (!SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Row as stored in Postgres (snake_case columns).
export type RegistrationRow = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string;
  guests: number;
  session_id: string;
  session_label: string;
  interests: string[];
  comments: string;
  consent: boolean;
};

export type NewRegistration = Omit<RegistrationRow, "id" | "created_at">;

export async function insertRegistration(reg: NewRegistration): Promise<void> {
  const res = await fetch(restUrl(TABLE), {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(reg),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase insert failed (${res.status}): ${detail}`);
  }
}

export async function listRegistrations(): Promise<RegistrationRow[]> {
  const res = await fetch(
    restUrl(`${TABLE}?select=*&order=created_at.desc`),
    { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase select failed (${res.status}): ${detail}`);
  }
  return (await res.json()) as RegistrationRow[];
}
