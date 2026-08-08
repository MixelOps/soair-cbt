import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Navbar />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">About us</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[var(--color-ink)]">The SOAIR CBT centre</h1>
        <p className="mt-5 text-[var(--color-slate)]">
          We manage the day-to-day operations around computer-based examinations —
          registration, scheduling, workstation allocation, and mock testing —
          without conducting official exam bodies' tests ourselves.
        </p>
      </section>
      <Footer />
    </div>
  );
}