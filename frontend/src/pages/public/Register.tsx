import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { RegistrationForm } from "../../features/candidate-registration/RegistrationForm";

export default function Register() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Navbar />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">Register</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[var(--color-ink)]">Candidate registration</h1>
        <p className="mt-3 mb-10 text-[var(--color-slate)]">Complete all three steps to secure your exam slot.</p>
        <RegistrationForm />
      </section>
      <Footer />
    </div>
  );
}