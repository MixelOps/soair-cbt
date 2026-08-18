import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { useAuthStore } from "../../store/authStore";

const inputClass = "w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-signal)] focus:outline-none focus:ring-1 focus:ring-[var(--color-signal)]";
const labelClass = "mb-1.5 block text-sm font-medium text-[var(--color-ink)]";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setAuth(data.accessToken, data.user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Navbar />
      <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-[var(--color-ink)]">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <label className={labelClass}>Email address</label>
            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-[var(--color-signal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0c8663] disabled:opacity-50">
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p className="text-center text-sm text-[var(--color-slate)]">
            Don't have an account? <Link to="/signup" className="text-[var(--color-signal)]">Sign up</Link>
          </p>
        </form>
      </section>
      <Footer />
    </div>
  );
}