"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhoneLink from "./PhoneLink";
import { LOCATION, BRAND } from "@/lib/seminar";

type Props = {
  firstName: string;
  sessionDay: string | null;
  sessionTime: string | null;
  calendarUrl: string | null;
};

export default function ThankYouCard({
  firstName,
  sessionDay,
  sessionTime,
  calendarUrl,
}: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-6 text-center">
        <div className="relative h-16 w-16" role="status" aria-label="Confirming your registration">
          <span className="absolute inset-0 rounded-full border-4 border-green/20" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green" />
        </div>
        <p className="text-lg font-semibold text-navy">
          Confirming your registration…
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm sm:p-12">
      {/* Success check */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green text-white shadow-md">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-8 w-8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-700">
        Registration Confirmed
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl">
        Thank You{firstName ? `, ${firstName}` : ""}!
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-charcoal/80">
        Your seat is reserved. A confirmation email and a reminder will be sent
        to you before the event.
      </p>

      {/* Session details */}
      <div className="mt-8 rounded-xl border border-navy/10 bg-cloud p-6 text-left">
        <h2 className="text-base font-bold uppercase tracking-wider text-navy">
          Your Seminar Details
        </h2>
        {sessionDay ? (
          <p className="mt-3 text-lg font-semibold text-charcoal">
            {sessionDay} — {sessionTime}
          </p>
        ) : (
          <p className="mt-3 text-charcoal/80">
            We&apos;ll confirm your session time by email.
          </p>
        )}
        <address className="mt-3 not-italic text-sm text-slate">
          <span className="font-semibold text-navy">{LOCATION.name}</span>
          <br />
          {LOCATION.street}
          <br />
          {LOCATION.city}, {LOCATION.state} {LOCATION.zip}
        </address>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {calendarUrl && (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green px-6 py-3 font-semibold text-white shadow-sm transition hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path strokeLinecap="round" d="M3 9h18M8 2v4M16 2v4" />
            </svg>
            Add to Calendar
          </a>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-navy/20 px-6 py-3 font-semibold text-navy transition hover:border-green hover:text-green-700"
        >
          Back to Home
        </Link>
      </div>

      <p className="mt-8 border-t border-navy/10 pt-6 text-sm text-slate">
        Need to make a change? Call{" "}
        <PhoneLink location="thank_you" className="font-semibold text-navy underline">
          {BRAND.phoneDisplay}
        </PhoneLink>{" "}
        or email{" "}
        <a href={`mailto:${BRAND.email}`} className="font-semibold text-navy underline">
          {BRAND.email}
        </a>
        .
      </p>
    </div>
  );
}
