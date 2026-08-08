import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="" className="font-display text-lg font-semibold text-[var(--color-ink)]">
          SOAIR <span className="text-[var(--color-signal)]">CBT</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Home</Link>
          <Link to="/about" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">About</Link>
          <Link to="/services" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Services</Link>
          <Link to="/calendar" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Exam calendar</Link>
          <Link to="/contact" className="text-sm text-[var(--color-slate)] hover:text-[var(--color-signal)]">Contact</Link>
        </nav>

        <Link
          to="/register"
          className="rounded-md bg-[var(--color-signal)] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c8663]"
        >
          Register now
        </Link>
      </div>
    </header>
  );
}