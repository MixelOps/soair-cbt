import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ConfirmDialog } from "../../components/ConfirmDialog";

type Workstation = { id: string; label: string; status: string };

const statusStyles: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_use: "bg-blue-50 text-blue-700 border-blue-200",
  faulty: "bg-red-50 text-red-700 border-red-200",
  maintenance: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Workstations() {
  const [items, setItems] = useState<Workstation[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Workstation | null>(null);

  const token = useAuthStore.getState().token;

  const load = () => {
    setLoading(true);
    fetch("http://localhost:3000/workstations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/workstations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add workstation");
      setLabel("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:3000/workstations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`http://localhost:3000/workstations/${deleteTarget.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleteTarget(null);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Workstations</h1>
      <p className="mt-1 text-sm text-[var(--color-slate)]">Track the computers available at the centre.</p>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="col-span-1 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-sm font-semibold text-[var(--color-ink)]">Add workstation</h2>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-ink)]">Label</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-signal)] focus:outline-none"
              placeholder="e.g. PC-01"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-[var(--color-signal)] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c8663]">
            Add workstation
          </button>
        </form>

        <div className="col-span-2 grid grid-cols-3 gap-3">
          {items.map((w) => (
            <div key={w.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-[var(--color-ink)]">{w.label}</span>
                <button onClick={() => setDeleteTarget(w)} className="text-xs text-red-500">Delete</button>
              </div>
              <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[w.status] ?? ""}`}>
                {w.status.replace("_", " ")}
              </span>
              <select
                value={w.status}
                onChange={(e) => updateStatus(w.id, e.target.value)}
                className="mt-3 w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
              >
                <option value="available">Available</option>
                <option value="in_use">In use</option>
                <option value="faulty">Faulty</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          ))}
          {!loading && items.length === 0 && (
            <p className="col-span-3 rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-[var(--color-slate)]">
              No workstations added yet.
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete workstation"
        message={deleteTarget ? `Remove ${deleteTarget.label} from the centre's inventory?` : ""}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}