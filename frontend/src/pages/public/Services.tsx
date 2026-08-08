import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

const services = [
  { tag: "SEAT A", title: "Exam registration", copy: "Book your slot for JAMB, NOUN, and other exam-body sittings held at our centre." },
  { tag: "SEAT B", title: "Mock examinations", copy: "Practice on the real interface, under real time pressure, before the day that counts." },
  { tag: "SEAT C", title: "Workstation booking", copy: "Reserve a monitored computer and seat ahead of your session, guaranteed and confirmed." },
];

export default function Services() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Navbar />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">Services</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[var(--color-ink)]">What we manage for you</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <span className="font-mono text-xs font-medium text-[var(--color-amber)]">{s.tag}</span>
              <h3 className="font-display mt-3 text-lg font-semibold text-[var(--color-ink)]">{s.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-slate)]">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}