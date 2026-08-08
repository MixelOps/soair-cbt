import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { ExamSlipCard } from "../../components/ExamSlipCard";

const services = [
  { tag: "SEAT A", title: "Exam registration", copy: "Book your slot for JAMB, NOUN, and other exam-body sittings held at our centre." },
  { tag: "SEAT B", title: "Mock examinations", copy: "Practice on the real interface, under real time pressure, before the day that counts." },
  { tag: "SEAT C", title: "Workstation booking", copy: "Reserve a monitored computer and seat ahead of your session, guaranteed and confirmed." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <Navbar />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">SOAIR CBT centre</p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)] md:text-5xl">
            Your seat is booked.<br />Your slip is ready.
          </h1>
          <p className="mt-5 max-w-md text-[var(--color-slate)]">
            Register for your examination, reserve your workstation, and walk in
            knowing exactly where you sit — no queues, no guesswork.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="/register" className="rounded-md bg-[var(--color-signal)] px-6 py-3 font-medium text-white hover:bg-[#0c8663]">
              Register for an exam
            </a>
            <a href="/calendar" className="rounded-md border border-slate-300 px-6 py-3 font-medium text-[var(--color-ink)] hover:bg-white">
              View exam calendar
            </a>
          </div>
        </div>

        <ExamSlipCard />
      </section>

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">What we manage for you</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-xl border border-slate-200 p-6">
                <span className="font-mono text-xs font-medium text-[var(--color-amber)]">{s.tag}</span>
                <h3 className="font-display mt-3 text-lg font-semibold text-[var(--color-ink)]">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-slate)]">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}