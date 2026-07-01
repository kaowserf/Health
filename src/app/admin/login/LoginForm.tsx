"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} className="relative mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-green/50"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-error">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green px-7 py-3 text-base font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80"
      >
        {pending && <Spinner />}
        {pending ? "Signing in…" : "Sign In"}
      </button>

      {/* Quick full-card loading overlay while the session is being created
          and the redirect to /admin is in flight. */}
      {pending && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm">
          <Spinner large />
          <p className="text-sm font-semibold text-navy">Signing you in…</p>
        </div>
      )}
    </form>
  );
}

function Spinner({ large = false }: { large?: boolean }) {
  const size = large ? "h-8 w-8" : "h-5 w-5";
  return (
    <svg className={`${size} animate-spin text-green`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
    </svg>
  );
}
