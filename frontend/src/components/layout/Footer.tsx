export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[var(--color-ink)] py-10 text-white">
      <div className="mx-auto max-w-6xl px-6 text-sm text-slate-300">
        <p className="font-display text-white">SOAIR CBT centre</p>
        <p className="mt-2">Managing exam operations — not the exams themselves.</p>
        <p className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} SOAIR CBT centre. All rights reserved.</p>
      </div>
    </footer>
  );
}