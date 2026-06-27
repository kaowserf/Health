import type { Metadata } from "next";
import Header from "@/components/Header";
import ThankYouCard from "@/components/ThankYouCard";
import { SESSIONS, LOCATION, BRAND } from "@/lib/seminar";

export const metadata: Metadata = {
  title: "Thank You for Registering | Estate Planning Seminar",
  robots: { index: false, follow: false },
};

// Build a Google Calendar "add event" link from a session.
function googleCalendarUrl(sessionId: string): string | null {
  const session = SESSIONS.find((s) => s.id === sessionId);
  if (!session) return null;
  const fmt = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Estate Planning Seminar: Wills & Living Trusts",
    dates: `${fmt(session.date)}/${fmt(session.endDate)}`,
    location: `${LOCATION.name}, ${LOCATION.street}, ${LOCATION.city}, ${LOCATION.state} ${LOCATION.zip}`,
    details: `Hosted by ${BRAND.name}. Questions? Call ${BRAND.phoneDisplay}.`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string; name?: string }>;
}) {
  const { session: sessionId, name } = await searchParams;
  const session = SESSIONS.find((s) => s.id === sessionId);
  const calendarUrl = sessionId ? googleCalendarUrl(sessionId) : null;
  const firstName = (name ?? "").trim();

  return (
    <>
      <Header />

      <main className="flex-1 bg-cloud">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
          <ThankYouCard
            firstName={firstName}
            sessionDay={session?.day ?? null}
            sessionTime={session?.time ?? null}
            calendarUrl={calendarUrl}
          />
        </div>
      </main>

      <footer className="bg-navy-900 py-6 text-center text-xs text-white/50">
        © 2026 {BRAND.name}. {BRAND.tagline}
      </footer>
    </>
  );
}
