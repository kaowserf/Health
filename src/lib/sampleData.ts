import type { RegistrationRow } from "./supabase";

// PREVIEW-ONLY sample rows. Used by the /admin panel when ADMIN_PREVIEW=1 and
// Supabase isn't configured yet, so the UI can be demoed locally. Safe to
// delete once the real database is connected.
export const SAMPLE_REGISTRATIONS: RegistrationRow[] = [
  {
    id: "sample-1",
    created_at: "2026-06-28T15:12:00.000Z",
    full_name: "Margaret Thompson",
    phone: "+18165551042",
    email: "margaret.t@example.com",
    guests: 1,
    session_id: "thu-sep-10-12pm",
    session_label: "Thursday, September 10 — 12:00 PM",
    interests: ["Estate Planning", "Living Trust"],
    comments: "Bringing my husband. Do we need to bring any documents?",
    consent: true,
  },
  {
    id: "sample-2",
    created_at: "2026-06-28T18:40:00.000Z",
    full_name: "Robert Chen",
    phone: "+18165552271",
    email: "rchen@example.com",
    guests: 0,
    session_id: "thu-sep-10-6pm",
    session_label: "Thursday, September 10 — 6:00 PM",
    interests: ["Retirement Planning", "Asset Protection"],
    comments: "",
    consent: true,
  },
  {
    id: "sample-3",
    created_at: "2026-06-29T09:05:00.000Z",
    full_name: "Linda & Carlos Rivera",
    phone: "+18165558890",
    email: "lrivera@example.com",
    guests: 3,
    session_id: "sat-sep-12-12pm",
    session_label: "Saturday, September 12 — 12:00 PM",
    interests: ["Long-Term Care Planning"],
    comments: "Party of four total — two couples.",
    consent: true,
  },
  {
    id: "sample-4",
    created_at: "2026-06-29T14:22:00.000Z",
    full_name: "James Whitfield",
    phone: "+18165553314",
    email: "jwhitfield@example.com",
    guests: 0,
    session_id: "thu-sep-10-12pm",
    session_label: "Thursday, September 10 — 12:00 PM",
    interests: [],
    comments: "",
    consent: true,
  },
];

export function isPreviewMode(): boolean {
  return process.env.ADMIN_PREVIEW === "1";
}
