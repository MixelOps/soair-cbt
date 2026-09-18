import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ConfirmDialog } from "../../components/ConfirmDialog";

type Question = {
  id: string;
  exam_body: string;
  exam_subject: string;
  question_text: string;
  options: string[];
  correct_index: number;
};

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-signal)] focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-[var(--color-ink)]";

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [examBody, setExamBody] = useState("jamb");
  const [examSubject, setExamSubject] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  const token = useAuthStore.getState().token;

  const load = () => {
    setLoading(true);
    fetch("http://localhost:3000/questions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => setQuestions(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ examBody, examSubject, questionText, options, correctIndex }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add question");
      setExamSubject(""); setQuestionText(""); setOptions(["", "", "", ""]); setCorrectIndex(0);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`http://localhost:3000/questions/${deleteTarget.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleteTarget(null);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Question bank</h1>
      <p className="mt-1 text-sm text-[var(--color-slate)]">Manage questions used in the exam kiosk.</p>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="col-span-1 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-sm font-semibold text-[var(--color-ink)]">Add question</h2>
          <div>
            <label className={labelClass}>Exam body</label>
            <select className={inputClass} value={examBody} onChange={(e) => setExamBody(e.target.value)}>
              <option value="jamb">JAMB (UTME)</option>
              <option value="noun">NOUN</option>
              <option value="waec">WAEC CBT</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Subject (must match session exactly)</label>
            <input className={inputClass} value={examSubject} onChange={(e) => setExamSubject(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Question</label>
            <textarea className={inputClass} rows={3} value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
          </div>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                title="Mark as correct answer"
              />
              <input
                className={inputClass}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => setOptions((prev) => prev.map((o, idx) => (idx === i ? e.target.value : o)))}
                required
              />
            </div>
          ))}
          <p className="text-xs text-[var(--color-slate)]">Select the radio button next to the correct option.</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-[var(--color-signal)] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c8663]">
            Add question
          </button>
        </form>

        <div className="col-span-2 space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--color-slate)]">{q.exam_body.toUpperCase()} — {q.exam_subject}</p>
                  <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{q.question_text}</p>
                </div>
                <button onClick={() => setDeleteTarget(q)} className="text-xs text-red-500">Delete</button>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-slate)]">
                {q.options.map((opt, i) => (
                  <li key={i} className={i === q.correct_index ? "font-medium text-emerald-600" : ""}>
                    {i === q.correct_index ? "✓ " : ""}{opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!loading && questions.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-[var(--color-slate)]">
              No questions added yet.
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete question"
        message={deleteTarget ? `Delete this question: "${deleteTarget.question_text}"?` : ""}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}