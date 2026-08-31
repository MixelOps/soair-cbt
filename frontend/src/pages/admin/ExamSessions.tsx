import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AdminLayout } from "../../components/layout/AdminLayout";

type Session = {
  id: string;
  exam_body: string;
  exam_subject: string;
  session_date: string;
  capacity: number;
};

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-signal)] focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-[var(--color-ink)]";

export default function ExamSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [examBody, setExamBody] = useState("jamb");
  const [examSubject, setExamSubject] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [error, setError] = useState("");

  const token = useAuthStore.getState().token;

  const load = () => {
    setLoading(true);
    fetch("http://localhost:3000/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load sessions");
        setSessions(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ examBody, examSubject, sessionDate, capacity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create session");
      setExamSubject(""); setSessionDate(""); setCapacity(50);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Exam sessions</h1>
      <p className="mt-1 text-sm text-[var(--color-slate)]">Schedule exam sittings candidates can register for.</p>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="col-span-1 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-sm font-semibold text-[var(--color-ink)]">New session</h2>
          <div>
            <label className={labelClass}>Exam body</label>
            <select className={inputClass} value={examBody} onChange={(e) => setExamBody(e.target.value)}>
              <option value="jamb">JAMB (UTME)</option>
              <option value="noun">NOUN</option>
              <option value="waec">WAEC CBT</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Subject</label>
            <input className={inputClass} value={examSubject} onChange={(e) => setExamSubject(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Session date</label>
            <input type="date" className={inputClass} value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Capacity</label>
            <input type="number" min={1} className={inputClass} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} required />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-[var(--color-signal)] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c8663]">
            Create session
          </button>
        </form>

        <div className="col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-[var(--color-slate)]">
              <tr>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{s.exam_body} — {s.exam_subject}</td>
                  <td className="px-4 py-3">{s.session_date}</td>
                  <td className="px-4 py-3">{s.capacity}</td>
                </tr>
              ))}
              {!loading && sessions.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-[var(--color-slate)]">No sessions scheduled yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}