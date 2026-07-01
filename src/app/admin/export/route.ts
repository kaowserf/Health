import { isAdmin } from "@/lib/auth";
import { listRegistrations, isSupabaseConfigured } from "@/lib/supabase";
import { SAMPLE_REGISTRATIONS } from "@/lib/sampleData";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const s = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  // Escape per RFC 4180; guard against CSV/formula injection in spreadsheets.
  const needsGuard = /^[=+\-@]/.test(s);
  const safe = needsGuard ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = isSupabaseConfigured()
    ? await listRegistrations()
    : SAMPLE_REGISTRATIONS;

  const header = [
    "Registered At",
    "Full Name",
    "Phone",
    "Email",
    "Additional Guests",
    "Party Size",
    "Session",
    "Areas of Interest",
    "Comments",
  ];

  const lines = rows.map((r) =>
    [
      r.created_at,
      r.full_name,
      r.phone,
      r.email,
      r.guests,
      1 + (r.guests ?? 0),
      r.session_label,
      r.interests,
      r.comments,
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = [header.map(csvCell).join(","), ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registrations.csv"`,
    },
  });
}
