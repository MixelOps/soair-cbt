import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AdminLayout } from "../../components/layout/AdminLayout";

type Candidate = {
  id: string;
  full_name: string;
  candidate_no: string;
  access_code: string;
  phone: string;
  exam_body: string;
  exam_subject: string;
  preferred_date: string;
  gender: string;
  state: string;
  status: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  payment_confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  seat_assigned: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const token = useAuthStore.getState().token;

  const load = () => {
    setLoading(true);
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
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`http://localhost:3000/candidates/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  const filtered = candidates.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.candidate_no.includes(search)
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Candidates</h1>
          <p className="mt-1 text-sm text-[var(--color-slate)]">{candidates.length} total registrations</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search by name or candidate no."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-[var(--color-signal)] focus:outline-none"
          />
          <button
            onClick={async () => {
              const res = await fetch("http://localhost:3000/candidates/export/excel", {
                headers: { Authorization: `Bearer ${token}` },
              });
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "candidates.xlsx";
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-slate-50"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-[var(--color-slate)]">Loading...</p>}
      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-[var(--color-slate)]">
              <tr>
                <th className="px-4 py-3">Candidate no.</th>
                <th className="px-4 py-3">Access code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Preferred date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-signal)]">{c.candidate_no}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-amber)]">{c.access_code}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{c.full_name}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3 capitalize">{c.gender}</td>
                  <td className="px-4 py-3">{c.state}</td>
                  <td className="px-4 py-3">{c.exam_body} — {c.exam_subject}</td>
                  <td className="px-4 py-3">{c.preferred_date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-[var(--color-slate)]">No matching candidates.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}