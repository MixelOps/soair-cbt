import { useEffect, useState } from "react";

type Question = { id: string; question_text: string; options: string[] };

const EXAM_DURATION_SECONDS = 30 * 60;

export default function Kiosk() {
  const [stage, setStage] = useState<"login" | "instructions" | "exam" | "done">("login");
  const [candidateNo, setCandidateNo] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);

  useEffect(() => {
    if (stage !== "exam") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const timeLow = secondsLeft <= 60;

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
      setStage("instructions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const startExam = () => {
    setSecondsLeft(EXAM_DURATION_SECONDS);
    setStage("exam");
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
            Continue
          </button>
        </form>
      </div>
    );
  }

  if (stage === "instructions") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-4 py-10">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">Before you begin</p>
          <h1 className="font-display mt-2 text-2xl font-semibold text-[var(--color-ink)]">Exam instructions</h1>
          <p className="mt-1 text-sm text-[var(--color-slate)]">Welcome, {candidateName}. Please read carefully before starting.</p>

          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--color-ink)]">{questions.length}</p>
                <p className="text-xs text-[var(--color-slate)]">Questions</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--color-ink)]">30</p>
                <p className="text-xs text-[var(--color-slate)]">Minutes</p>
              </div>
            </div>
          </div>

          <ol className="mt-6 space-y-4 text-sm text-[var(--color-ink)]">
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-xs font-medium text-[var(--color-signal)]">1</span>
              <span>A countdown timer stays visible at the top of the screen. The exam submits automatically when it reaches zero, whether or not every question has been answered.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-xs font-medium text-[var(--color-signal)]">2</span>
              <span>Use the question navigator on the right to jump straight to any question, or move in order using Previous and Next. Answered questions turn green.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-xs font-medium text-[var(--color-signal)]">3</span>
              <span>You may change any answer at any time before submitting. Once you click Submit exam, your answers are final.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-xs font-medium text-[var(--color-signal)]">4</span>
              <span>Do not close this tab or refresh the page during the exam. If you run into a technical issue, raise your hand for an invigilator rather than trying to fix it yourself.</span>
            </li>
          </ol>

          <button onClick={startExam} className="mt-8 w-full rounded-md bg-[var(--color-signal)] px-6 py-3 text-sm font-medium text-white hover:bg-[#0c8663]">
            I understand — start my exam
          </button>
        </div>
      </div>
    );
  }

  if (stage === "exam") {
    const q = questions[current];
    return (
      <div className="min-h-screen bg-[var(--color-paper)]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">{candidateName}</p>
            <p className="text-xs text-[var(--color-slate)]">Candidate no. {candidateNo}</p>
          </div>
          <div className={`flex items-center gap-2 rounded-md px-4 py-2 ${timeLow ? "bg-red-50" : "bg-amber-50"}`}>
            <span className={`font-mono text-base font-medium ${timeLow ? "text-red-600" : "text-amber-700"}`}>
              {mins}:{secs} remaining
            </span>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_300px] gap-10 px-8 py-10">
          <div className="min-h-[520px] rounded-xl border border-slate-200 bg-white p-10">
            <p className="text-xs text-[var(--color-slate)]">Question {current + 1} of {questions.length}</p>
            <p className="mt-4 text-xl leading-relaxed text-[var(--color-ink)]">{q.question_text}</p>

            <div className="mt-8 space-y-3">
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 rounded-md border px-5 py-4 cursor-pointer ${
                    answers[q.id] === i ? "border-[var(--color-signal)] bg-[var(--color-signal)]/5" : "border-slate-200"
                  }`}
                >
                  <input type="radio" checked={answers[q.id] === i} onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))} />
                  <span className="text-base">{opt}</span>
                </label>
              ))}
            </div>

            <div className="mt-12 flex justify-between border-t border-slate-100 pt-6">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="rounded-md border border-slate-300 px-6 py-3 text-sm font-medium disabled:opacity-40"
              >
                Previous
              </button>
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent((c) => c + 1)} className="rounded-md bg-[var(--color-signal)] px-8 py-3 text-sm font-medium text-white">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} className="rounded-md bg-red-500 px-8 py-3 text-sm font-medium text-white hover:bg-red-600">
                  Submit exam
                </button>
              )}
            </div>
          </div>

          <div className="h-fit rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-[var(--color-slate)]">Question navigator</p>
            <div className="mt-3 grid max-h-[420px] grid-cols-5 gap-2 overflow-y-auto pr-1">
              {questions.map((qq, i) => {
                const answered = answers[qq.id] !== undefined;
                const isCurrent = i === current;
                return (
                  <button
                    key={qq.id}
                    onClick={() => setCurrent(i)}
                    className={`flex h-10 items-center justify-center rounded-md border text-sm font-medium ${
                      isCurrent
                        ? "border-[var(--color-signal)] bg-[var(--color-signal)] text-white"
                        : answered
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-[var(--color-slate)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 space-y-2 text-xs text-[var(--color-slate)]">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-100 border border-emerald-300" /> Answered</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-slate-300" /> Unanswered</div>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 w-full rounded-md bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
            >
              Submit exam
            </button>
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