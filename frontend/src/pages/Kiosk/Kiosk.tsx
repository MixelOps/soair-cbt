import { useState } from "react";

type Question = { id: string; question_text: string; options: string[] };

export default function Kiosk() {
  const [stage, setStage] = useState<"login" | "exam" | "done">("login");
  const [candidateNo, setCandidateNo] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/kiosk/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateNo, accessCode }),
      });
            const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions found for this exam. Contact an administrator.");
      }
      setCandidateName(data.candidate.fullName);
      setQuestions(data.questions);
      setStage("exam");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/kiosk/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateNo, accessCode, answers }),
    });
    const data = await res.json();
    setResult(data);
    setStage("done");
  };

  if (stage === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-4">
        <form onSubmit={handleVerify} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Enter your exam</h1>
          <p className="mt-1 text-sm text-[var(--color-slate)]">Enter your candidate number and access code.</p>
          <div className="mt-6 space-y-4">
            <input
              placeholder="Candidate number"
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm font-mono"
              value={candidateNo}
              onChange={(e) => setCandidateNo(e.target.value)}
              required
            />
            <input
              placeholder="Access code"
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm font-mono uppercase"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              required
            />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <button type="submit" className="mt-6 w-full rounded-md bg-[var(--color-signal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0c8663]">
            Start exam
          </button>
        </form>
      </div>
    );
  }

  if (stage === "exam") {
    const q = questions[current];
    return (
      <div className="min-h-screen bg-[var(--color-paper)] p-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-slate-200 bg-white px-6 py-3">
            <span className="text-sm font-medium text-[var(--color-ink)]">{candidateName}</span>
            <span className="text-xs text-[var(--color-slate)]">Question {current + 1} of {questions.length}</span>
          </div>
          <div className="rounded-b-xl border border-slate-200 bg-white p-6">
            <p className="text-base text-[var(--color-ink)]">{q.question_text}</p>
            <div className="mt-5 space-y-2">
              {q.options.map((opt, i) => (
                <label key={i} className={`flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer ${answers[q.id] === i ? "border-[var(--color-signal)] bg-[var(--color-signal)]/5" : "border-slate-200"}`}>
                  <input type="radio" checked={answers[q.id] === i} onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))} />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium disabled:opacity-40"
              >
                Previous
              </button>
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent((c) => c + 1)} className="rounded-md bg-[var(--color-signal)] px-6 py-2.5 text-sm font-medium text-white">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} className="rounded-md bg-[var(--color-signal)] px-6 py-2.5 text-sm font-medium text-white">
                  Submit exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Exam submitted</h2>
        <p className="mt-4 text-sm text-[var(--color-slate)]">
          You scored {result?.correctAnswers} out of {result?.totalQuestions}
        </p>
        <p className="font-display mt-2 text-3xl font-semibold text-[var(--color-signal)]">{result?.score}%</p>
      </div>
    </div>
  );
}