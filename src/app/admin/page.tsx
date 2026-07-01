import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { listRegistrations, isSupabaseConfigured, type RegistrationRow } from "@/lib/supabase";
import { SAMPLE_REGISTRATIONS, isPreviewMode } from "@/lib/sampleData";
import { SESSIONS, LOGO_SRC, BRAND } from "@/lib/seminar";
import { colorFor } from "./palette";
import { logout } from "./actions";
import CountUp from "./CountUp";
import SessionChart from "./SessionChart";
import RegistrantBoard from "./RegistrantBoard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Registrations — Admin", robots: { index: false } };

const partySize = (r: RegistrationRow) => 1 + (r.guests ?? 0);

// Short chip label, e.g. "Sep 10 · 12:00 PM".
function sessionChip(day: string, time: string): string {
  const md = (day.split(", ")[1] ?? day).replace("September", "Sep");
  return `${md} · ${time}`;
}

export default async function AdminPage() {
  await requireAdmin();

  if (!isSupabaseConfigured() && !isPreviewMode()) {
    return (
      <Shell>
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          <h2 className="font-bold">Database not configured</h2>
          <p className="mt-2 text-sm">
            Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>, then run{" "}
            <code>supabase/registrations.sql</code>. Until then, new sign-ups are not stored.
          </p>
        </div>
      </Shell>
    );
  }

  let rows: RegistrationRow[] = [];
  let loadError: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      rows = await listRegistrations();
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Failed to load registrations.";
    }
  } else {
    rows = SAMPLE_REGISTRATIONS;
  }

  const preview = !isSupabaseConfigured() && isPreviewMode();
  const totalSignups = rows.length;
  const totalHeadcount = rows.reduce((sum, r) => sum + partySize(r), 0);
  const avgParty = totalSignups ? (totalHeadcount / totalSignups).toFixed(1) : "0";

  const sessionMeta = SESSIONS.map((s, i) => {
    const sr = rows.filter((r) => r.session_id === s.id);
    return {
      id: s.id,
      label: s.label,
      chip: sessionChip(s.day, s.time),
      color: colorFor(i),
      signups: sr.length,
      headcount: sr.reduce((sum, r) => sum + partySize(r), 0),
    };
  });

  return (
    <Shell preview={preview} error={loadError}>
      {/* Hero stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <HeroStat
          label="Total Sign-ups"
          value={totalSignups}
          accent="#5ebc2c"
          icon={<><path d="M4 17v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><circle cx="10" cy="6" r="3" /></>}
        />
        <HeroStat
          label="Total Attendees"
          value={totalHeadcount}
          accent="#2563eb"
          icon={<><circle cx="7" cy="7" r="2.5" /><circle cx="13" cy="7" r="2.5" /><path d="M3 16v-1a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1M11 16v-1a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1" /></>}
        />
        <HeroStat
          label="Avg. Party Size"
          value={avgParty}
          accent="#f59e0b"
          icon={<><path d="M10 3 4 6v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V6l-6-3Z" /></>}
        />
      </div>

      {/* Visual session breakdown */}
      <div className="mt-6">
        <SessionChart
          bars={sessionMeta.map((s) => ({
            label: s.chip,
            headcount: s.headcount,
            signups: s.signups,
            color: s.color,
          }))}
        />
      </div>

      {/* Registrant cards */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-navy">Registrants</h2>
        <RegistrantBoard
          rows={rows}
          sessions={sessionMeta.map((s) => ({ id: s.id, label: s.label, chip: s.chip, color: s.color }))}
        />
      </div>
    </Shell>
  );
}

function Shell({
  children,
  preview,
  error,
}: {
  children: React.ReactNode;
  preview?: boolean;
  error?: string | null;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src={LOGO_SRC}
              alt={`${BRAND.name} Financial Services`}
              width={471}
              height={229}
              priority
              className="h-9 w-auto sm:h-10"
            />
            <span className="hidden h-7 w-px bg-slate-200 sm:block" />
            <h1 className="hidden text-sm font-semibold text-slate-500 sm:block">Registrations</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/export"
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5" /><path d="M4 14v2h12v-2" />
              </svg>
              <span className="hidden sm:inline">Export</span>
            </a>
            <form action={logout}>
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm transition hover:bg-slate-50">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8">
        {preview && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">PREVIEW</span>
            Sample data — connect Supabase &amp; remove <code>ADMIN_PREVIEW</code> to go live.
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-xl border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">{error}</div>
        )}
        {children}
      </main>
    </div>
  );
}

function HeroStat({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number | string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${accent}1a`, color: accent }}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            {icon}
          </svg>
        </span>
      </div>
      <p className="mt-3 text-4xl font-extrabold tracking-tight text-navy">
        {typeof value === "number" ? <CountUp value={value} /> : value}
      </p>
    </div>
  );
}
