import { useEffect, useState } from "react";
import { StepIndicator } from "../../components/StepIndicator";
import { PassportUpload } from "../../components/PassportUpload";
import { useAuthStore } from "../../store/authStore";

type Session = {
  id: string;
  exam_body: string;
  exam_subject: string;
  session_date: string;
  capacity: number;
};

type FormData = {
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
  state: string;
  sessionId: string;
  passportFile: File | null;
};

const initialData: FormData = {
  fullName: "",
  phone: "",
  dob: "",
  gender: "",
  state: "",
  sessionId: "",
  passportFile: null,
};

const steps = ["Personal details", "Exam selection", "Review & submit"];

const inputClass =
  "w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-signal)] focus:outline-none focus:ring-1 focus:ring-[var(--color-signal)]";
const labelClass = "mb-1.5 block text-sm font-medium text-[var(--color-ink)]";

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [candidateNo, setCandidateNo] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    fetch("http://localhost:3000/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => setSessions(Array.isArray(d) ? d : []))
      .finally(() => setSessionsLoading(false));
  }, []);

  const update = (field: keyof FormData, value: string | File | null) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep0 = data.fullName && data.phone && data.dob && data.gender && data.state;
  const canProceedStep1 = data.sessionId;

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const selectedSession = sessions.find((s) => s.id === data.sessionId);

  const handleSubmit = async () => {
    setSubmitError("");
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch("http://localhost:3000/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          dob: data.dob,
          gender: data.gender,
          state: data.state,
          sessionId: data.sessionId,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Submission failed");
      setCandidateNo(result.candidate_no);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-2xl text-[var(--color-signal)]">
          {"\u2713"}
        </div>
        <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Registration received</h2>
        <p className="mt-2 text-sm text-[var(--color-slate)]">
          You'll receive your seat assignment by email once payment is confirmed.
        </p>
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-left font-mono text-sm">
          <p className="text-xs text-[var(--color-slate)]">Candidate no.</p>
          <p className="text-lg font-medium text-[var(--color-ink)]">{candidateNo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {currentStep === 0 && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Full name</label>
              <input className={inputClass} value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="As it appears on your ID" />
            </div>
            <div>
              <label className={labelClass}>Phone number</label>
              <input className={inputClass} value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="080..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date of birth</label>
                <input type="date" className={inputClass} value={data.dob} onChange={(e) => update("dob", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select className={inputClass} value={data.gender} onChange={(e) => update("gender", e.target.value)}>
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>State of residence</label>
              <input className={inputClass} value={data.state} onChange={(e) => update("state", e.target.value)} placeholder="e.g. Rivers" />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Select an exam session</label>
              {sessionsLoading && <p className="text-sm text-[var(--color-slate)]">Loading available sessions...</p>}
              {!sessionsLoading && sessions.length === 0 && (
                <p className="text-sm text-[var(--color-slate)]">No exam sessions are currently scheduled. Check back soon.</p>
              )}
              {!sessionsLoading && sessions.length > 0 && (
                <select className={inputClass} value={data.sessionId} onChange={(e) => update("sessionId", e.target.value)}>
                  <option value="">Select a session</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.exam_body.toUpperCase()} — {s.exam_subject} — {s.session_date}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className={labelClass}>Passport photograph</label>
              <PassportUpload file={data.passportFile} onChange={(f) => update("passportFile", f)} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">Review your details</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div><dt className="text-[var(--color-slate)]">Full name</dt><dd className="font-medium text-[var(--color-ink)]">{data.fullName || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Phone</dt><dd className="font-medium text-[var(--color-ink)]">{data.phone || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Date of birth</dt><dd className="font-medium text-[var(--color-ink)]">{data.dob || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Exam session</dt><dd className="font-medium text-[var(--color-ink)]">
                {selectedSession ? `${selectedSession.exam_body.toUpperCase()} — ${selectedSession.exam_subject} — ${selectedSession.session_date}` : "-"}
              </dd></div>
              <div><dt className="text-[var(--color-slate)]">Passport photo</dt><dd className="font-medium text-[var(--color-ink)]">{data.passportFile?.name || "Not uploaded"}</dd></div>
            </dl>
          </div>
        )}

        {submitError && <p className="mt-6 text-sm text-red-500">{submitError}</p>}

        <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] disabled:opacity-40"
          >
            Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={next}
              disabled={(currentStep === 0 && !canProceedStep0) || (currentStep === 1 && !canProceedStep1)}
              className="rounded-md bg-[var(--color-signal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0c8663] disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded-md bg-[var(--color-signal)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0c8663]"
            >
              Submit registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}