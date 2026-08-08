import { useEffect, useState } from "react";

export function ExamSlipCard() {
  const [seconds, setSeconds] = useState(2272); // 37:52 remaining, purely illustrative

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute inset-x-6 top-6 h-full rounded-2xl bg-[var(--color-ink)]/5 blur-md" />

      <div className="relative rotate-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-transform hover:rotate-0 overflow-hidden">
        <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--color-paper)] border border-slate-200 z-10" />
        <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--color-paper)] border border-slate-200 z-10" />

        <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-slate)]">Examination slip</p>
        <p className="font-display mt-1 text-lg font-semibold text-[var(--color-ink)]">UTME mock — mathematics</p>

        <div className="my-4 border-t border-dashed border-slate-200" />

        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div>
            <p className="text-xs text-[var(--color-slate)]">Candidate no.</p>
            <p className="font-medium text-[var(--color-ink)]">20260041</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-slate)]">Seat</p>
            <p className="font-medium text-[var(--color-ink)]">B-14</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-slate)]">Date</p>
            <p className="font-medium text-[var(--color-ink)]">12 Aug 2026</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-slate)]">Time remaining</p>
            <p className="font-medium text-[var(--color-amber)]">{mins}:{secs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}