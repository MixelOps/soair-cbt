import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

export default function ExamCalendar() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Navbar />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">Exam calendar</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[var(--color-ink)]">Upcoming sessions</h1>
        <p className="mt-5 text-[var(--color-slate)]">
          Scheduled examination and mock test dates will appear here once
          session management is connected to the backend.
        </p>
      </section>
      <Footer />
    </div>
  );
}