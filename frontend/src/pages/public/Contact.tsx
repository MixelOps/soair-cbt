import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

export default function Contact() {
  return (
   <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Navbar />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-20">
        
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">Contact</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[var(--color-ink)]">Get in touch</h1>
        <p className="mt-5 text-[var(--color-slate)]">
          Contact form and centre location details will go here.
        </p>
      </section>
      <Footer />
    </div>
  );
}