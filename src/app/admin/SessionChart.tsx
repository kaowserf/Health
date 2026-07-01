"use client";

type Bar = {
  label: string;
  headcount: number;
  signups: number;
  color: string;
};

// Horizontal bar chart of headcount per session. Bars grow on mount.
export default function SessionChart({ bars }: { bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.headcount));
  const total = bars.reduce((s, b) => s + b.headcount, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Attendees by session
        </h2>
        <span className="text-xs text-slate-400">{total} total</span>
      </div>

      <div className="space-y-4">
        {bars.map((b, i) => {
          const pct = total ? Math.round((b.headcount / total) * 100) : 0;
          const width = (b.headcount / max) * 100;
          return (
            <div key={b.label}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-charcoal">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
                  {b.label}
                </span>
                <span className="tabular-nums text-slate-500">
                  <strong className="text-navy">{b.headcount}</strong>
                  <span className="ml-1 text-xs text-slate-400">· {b.signups} sign-ups · {pct}%</span>
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="animate-grow-x h-full rounded-full"
                  style={{
                    width: `${width}%`,
                    background: b.color,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
