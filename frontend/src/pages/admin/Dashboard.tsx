import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AdminLayout } from "../../components/layout/AdminLayout";

type Candidate = {
  id: string;
  full_name: string;
  candidate_no: string;
  exam_body: string;
  exam_subject: string;
  preferred_date: string;
  created_at: string;
};

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = useAuthStore.getState().token;
    fetch("http://localhost:3000/candidates", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setCandidates(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const todayCount = candidates.filter(
    (c) => new Date(c.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-slate)]">Overview of candidate registrations.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--color-slate)]">Total candidates</p>
          <p className="font-display mt-2 text-3xl font-semibold text-[var(--color-ink)]">{candidates.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--color-slate)]">Registered today</p>
          <p className="font-display mt-2 text-3xl font-semibold text-[var(--color-signal)]">{todayCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--color-slate)]">Exam bodies</p>
          <p className="font-display mt-2 text-3xl font-semibold text-[var(--color-amber)]">
            {new Set(candidates.map((c) => c.exam_body)).size}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-[var(--color-ink)]">Recent registrations</h2>

        {loading && <p className="mt-4 text-sm text-[var(--color-slate)]">Loading...</p>}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="mt-4 space-y-2">
            {candidates.slice(0, 8).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">{c.full_name}</p>
                  <p className="font-mono text-xs text-[var(--color-slate)]">{c.candidate_no}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-[var(--color-ink)]">{c.exam_body} — {c.exam_subject}</p>
                  <p className="text-xs text-[var(--color-slate)]">{c.preferred_date}</p>
                </div>
              </div>
            ))}
            {candidates.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-[var(--color-slate)]">
                No candidates registered yet.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}