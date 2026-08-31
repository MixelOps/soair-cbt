import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AdminLayout } from "../../components/layout/AdminLayout";

const inputClass = "w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:border-[var(--color-signal)] focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-[var(--color-ink)]";

export default function Staff() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("administrator");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch("http://localhost:3000/auth/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create staff");
      setMessage(`Staff account created: ${data.email}`);
      setFirstName(""); setLastName(""); setEmail(""); setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Staff</h1>
      <p className="mt-1 text-sm text-[var(--color-slate)]">Create staff accounts for centre operations.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First name</label>
            <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Temporary password</label>
          <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="administrator">Administrator</option>
            <option value="examination_officer">Examination Officer</option>
            <option value="invigilator">Invigilator</option>
          </select>
        </div>
        {message && <p className="text-sm text-[var(--color-signal)]">{message}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="w-full rounded-md bg-[var(--color-signal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0c8663]">
          Create staff account
        </button>
      </form>
    </AdminLayout>
  );
}