"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationInput } from "@/lib/schema";
import { SESSIONS, INTERESTS, BRAND } from "@/lib/seminar";
import { track } from "@/lib/analytics";
import PhoneLink from "./PhoneLink";

const fieldBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-base text-charcoal shadow-sm transition placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-green/50 min-h-[44px]";

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm font-medium text-error">
      {msg}
    </p>
  );
}

export default function RegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [startedTracked, setStartedTracked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      guests: 0,
      interests: [],
      comments: "",
      botField: "",
    },
    mode: "onBlur",
  });

  const onFirstInteraction = () => {
    if (!startedTracked) {
      track("form_start");
      setStartedTracked(true);
    }
  };

  const onSubmit = async (values: RegistrationInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      track("form_submit", { session: values.session, guests: Number(values.guests) });

      // Redirect to the dedicated thank-you page with the chosen session + name.
      const firstName = values.fullName.trim().split(/\s+/)[0] ?? "";
      const params = new URLSearchParams({
        session: String(values.session),
        name: firstName,
      });
      setRedirecting(true);
      router.push(`/thank-you?${params.toString()}`);
    } catch (err) {
      track("form_error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  if (redirecting) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <svg className="h-8 w-8 animate-spin text-green" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
        <p className="font-semibold text-navy">Reserving your seat…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={onFirstInteraction}
      noValidate
      className="space-y-6"
    >
      {/* Honeypot — hidden from users, catches bots (PRD §6.2).
          Neutral name/label + autocomplete off so browsers never autofill it. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="botField">Leave this field blank</label>
        <input
          id="botField"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("botField")}
        />
      </div>

      <div>
        <label htmlFor="fullName" className="mb-1.5 block font-semibold text-navy">
          Full Name <span className="text-error">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.fullName}
          className={`${fieldBase} ${errors.fullName ? "border-error" : "border-slate/30"}`}
          {...register("fullName")}
        />
        <ErrorText msg={errors.fullName?.message} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block font-semibold text-navy">
            Phone Number <span className="text-error">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(816) 555-1234"
            aria-invalid={!!errors.phone}
            className={`${fieldBase} ${errors.phone ? "border-error" : "border-slate/30"}`}
            {...register("phone")}
          />
          <ErrorText msg={errors.phone?.message} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block font-semibold text-navy">
            Email Address <span className="text-error">*</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`${fieldBase} ${errors.email ? "border-error" : "border-slate/30"}`}
            {...register("email")}
          />
          <ErrorText msg={errors.email?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="guests" className="mb-1.5 block font-semibold text-navy">
          Additional Guests Attending <span className="text-error">*</span>
        </label>
        <select
          id="guests"
          aria-invalid={!!errors.guests}
          className={`${fieldBase} ${errors.guests ? "border-error" : "border-slate/30"}`}
          {...register("guests")}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i}>
              {i === 0 ? "Just me" : `${i} guest${i > 1 ? "s" : ""}`}
            </option>
          ))}
        </select>
        <ErrorText msg={errors.guests?.message} />
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold text-navy">
          Preferred Session <span className="text-error">*</span>
        </legend>
        <div className="space-y-2.5">
          {SESSIONS.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate/30 p-3.5 transition hover:border-green has-[:checked]:border-green has-[:checked]:bg-green-100/70"
            >
              <input
                type="radio"
                value={s.id}
                className="h-5 w-5 accent-green"
                {...register("session")}
              />
              <span className="font-medium text-charcoal">{s.label}</span>
            </label>
          ))}
        </div>
        <ErrorText msg={errors.session?.message} />
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold text-navy">
          Areas of Interest{" "}
          <span className="font-normal text-slate">(optional)</span>
        </legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {INTERESTS.map((interest) => (
            <label
              key={interest}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate/30 p-3 transition hover:border-green has-[:checked]:border-green has-[:checked]:bg-green-100/60"
            >
              <input
                type="checkbox"
                value={interest}
                className="h-5 w-5 accent-green"
                {...register("interests")}
              />
              <span className="text-charcoal">{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="comments" className="mb-1.5 block font-semibold text-navy">
          Additional Comments{" "}
          <span className="font-normal text-slate">(optional)</span>
        </label>
        <textarea
          id="comments"
          rows={4}
          maxLength={500}
          aria-invalid={!!errors.comments}
          className={`${fieldBase} resize-y ${errors.comments ? "border-error" : "border-slate/30"}`}
          {...register("comments")}
        />
        <ErrorText msg={errors.comments?.message} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-green"
            aria-invalid={!!errors.consent}
            {...register("consent")}
          />
          <span className="text-sm text-charcoal">
            I agree to be contacted about this seminar.{" "}
            <span className="text-error">*</span>
          </span>
        </label>
        <ErrorText msg={errors.consent?.message} />
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-error/40 bg-error/5 p-4 text-sm text-error"
        >
          {serverError} Trouble registering? Call{" "}
          <PhoneLink location="form_error" className="font-semibold underline">
            {BRAND.phoneDisplay}
          </PhoneLink>
          .
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green px-7 py-4 text-lg font-bold tracking-wide text-white shadow-md transition hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-green/40 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
        )}
        {isSubmitting ? "Reserving…" : "Save My Seat"}
      </button>

      <p className="text-center text-xs text-slate">
        Your information is used only to confirm your reservation and follow up
        about this seminar.
      </p>
    </form>
  );
}
