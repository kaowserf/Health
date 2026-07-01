"use client";

import { useMemo, useState } from "react";
import type { RegistrationRow } from "@/lib/supabase";
import CopyButton from "./CopyButton";

type SessionMeta = { id: string; label: string; chip: string; color: string };

const partySize = (r: RegistrationRow) => 1 + (r.guests ?? 0);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type SortKey = "date" | "name" | "phone" | "email" | "guests" | "party" | "session";

export default function RegistrantBoard({
  rows,
  sessions,
}: {
  rows: RegistrationRow[];
  sessions: SessionMeta[];
}) {
  const [query, setQuery] = useState("");
  const [session, setSession] = useState("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);

  const sessionById = useMemo(() => {
    const m: Record<string, SessionMeta> = {};
    for (const s of sessions) m[s.id] = s;
    return m;
  }, [sessions]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: rows.length };
    for (const r of rows) map[r.session_id] = (map[r.session_id] ?? 0) + 1;
    return map;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = rows.filter((r) => {
      if (session !== "all" && r.session_id !== session) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.interests ?? []).join(" ").toLowerCase().includes(q) ||
        r.comments.toLowerCase().includes(q)
      );
    });

    out.sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case "date": cmp = a.created_at.localeCompare(b.created_at); break;
        case "name": cmp = a.full_name.localeCompare(b.full_name); break;
        case "phone": cmp = a.phone.localeCompare(b.phone); break;
        case "email": cmp = a.email.localeCompare(b.email); break;
        case "guests": cmp = (a.guests ?? 0) - (b.guests ?? 0); break;
        case "party": cmp = partySize(a) - partySize(b); break;
        case "session": cmp = a.session_label.localeCompare(b.session_label); break;
      }
      return asc ? cmp : -cmp;
    });
    return out;
  }, [rows, query, session, sort, asc]);

  const shownHeadcount = filtered.reduce((s, r) => s + partySize(r), 0);

  function toggleSort(key: SortKey) {
    if (sort === key) setAsc((v) => !v);
    else {
      setSort(key);
      setAsc(key === "name" || key === "email"); // text default A→Z
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
            <circle cx="9" cy="9" r="6" />
            <path d="m17 17-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm shadow-sm transition focus:border-green focus:outline-none focus:ring-2 focus:ring-green/30"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
          )}
        </div>
        <BulkCopy label="Emails" values={filtered.map((r) => r.email)} />
        <BulkCopy label="Phones" values={filtered.map((r) => r.phone)} />
      </div>

      {/* Filter chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={session === "all"} onClick={() => setSession("all")} count={counts.all ?? 0} />
        {sessions.map((s) => (
          <Chip key={s.id} active={session === s.id} onClick={() => setSession(s.id)} count={counts[s.id] ?? 0} color={s.color} label={s.chip} />
        ))}
      </div>

      <p className="mb-3 text-sm text-slate-500">
        <strong className="text-navy">{filtered.length}</strong> sign-ups ·{" "}
        <strong className="text-navy">{shownHeadcount}</strong> attendees
      </p>

      {/* Excel-style table */}
      <div className="overflow-auto rounded-xl border border-slate-300 bg-white shadow-sm">
        <table className="w-full min-w-[1040px] border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <Th className="w-12 text-center">#</Th>
              <Th sortKey="date" {...{ sort, asc, toggleSort }}>Date</Th>
              <Th sortKey="name" {...{ sort, asc, toggleSort }}>Full Name</Th>
              <Th sortKey="phone" {...{ sort, asc, toggleSort }}>Phone</Th>
              <Th sortKey="email" {...{ sort, asc, toggleSort }}>Email</Th>
              <Th sortKey="guests" {...{ sort, asc, toggleSort }} className="text-center">Guests</Th>
              <Th sortKey="party" {...{ sort, asc, toggleSort }} className="text-center">Party</Th>
              <Th sortKey="session" {...{ sort, asc, toggleSort }}>Session</Th>
              <Th>Interests</Th>
              <Th>Comments</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="border border-slate-200 px-4 py-12 text-center text-slate-400">
                  {rows.length === 0 ? "No registrations yet." : "No matches."}
                </td>
              </tr>
            )}
            {filtered.map((r, i) => {
              const meta = sessionById[r.session_id];
              return (
                <tr key={r.id} className="even:bg-slate-50/60 hover:bg-green-100/40">
                  <Td className="bg-slate-50 text-center font-medium text-slate-400">{i + 1}</Td>
                  <Td className="whitespace-nowrap text-slate-500">{formatDate(r.created_at)}</Td>
                  <Td className="font-semibold text-navy">{r.full_name}</Td>
                  <Td className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <a href={`tel:${r.phone}`} className="text-charcoal hover:text-green hover:underline">{r.phone}</a>
                      <CopyButton value={r.phone} label="Copy phone" />
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <a href={`mailto:${r.email}`} className="text-charcoal hover:text-green hover:underline">{r.email}</a>
                      <CopyButton value={r.email} label="Copy email" />
                    </span>
                  </Td>
                  <Td className="text-center tabular-nums text-slate-600">{r.guests}</Td>
                  <Td className="text-center">
                    <span className="font-bold tabular-nums text-navy">{partySize(r)}</span>
                  </Td>
                  <Td className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: meta?.color ?? "#94a3b8" }} />
                      {meta?.chip ?? r.session_label}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {(r.interests ?? []).map((it) => (
                        <span key={it} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{it}</span>
                      ))}
                    </div>
                  </Td>
                  <Td className="min-w-[200px] max-w-[280px] text-slate-600">{r.comments}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  className = "",
  sortKey,
  sort,
  asc,
  toggleSort,
}: {
  children?: React.ReactNode;
  className?: string;
  sortKey?: SortKey;
  sort?: SortKey;
  asc?: boolean;
  toggleSort?: (k: SortKey) => void;
}) {
  const active = sortKey && sort === sortKey;
  return (
    <th
      onClick={sortKey && toggleSort ? () => toggleSort(sortKey) : undefined}
      className={`border border-slate-300 px-3 py-2.5 ${sortKey ? "cursor-pointer select-none hover:bg-slate-200" : ""} ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {active && <span className="text-green">{asc ? "▲" : "▼"}</span>}
      </span>
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border border-slate-200 px-3 py-2 align-middle ${className}`}>{children}</td>;
}

function BulkCopy({ label, values }: { label: string; values: string[] }) {
  const [copied, setCopied] = useState(false);
  const list = values.filter(Boolean);
  async function copy() {
    if (!list.length) return;
    const text = list.join(", ");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }
  return (
    <button
      type="button"
      onClick={copy}
      disabled={!list.length}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-navy shadow-sm transition hover:border-green hover:text-green disabled:opacity-40"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <rect x="7" y="7" width="9" height="9" rx="2" /><path d="M4 13V5a2 2 0 0 1 2-2h6" />
      </svg>
      {copied ? "Copied" : `${label} ${list.length}`}
    </button>
  );
}

function Chip({
  active,
  onClick,
  count,
  color,
  label = "All",
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  color?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active ? "border-transparent text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
      style={active ? { background: color ?? "#0f2a47" } : undefined}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ background: active ? "#fff" : color }} />}
      {label}
      <span className={`rounded-full px-1.5 text-xs font-bold ${active ? "bg-white/25" : "bg-slate-100 text-slate-500"}`}>{count}</span>
    </button>
  );
}
