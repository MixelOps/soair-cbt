import { useEffect, useState } from "react";
import { StepIndicator } from "../../components/StepIndicator";
import { PassportUpload } from "../../components/PassportUpload";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  state: string;
  examBody: string;
  examBodyOther: string;
  examSubject: string;
  preferredDate: string;
  passportFile: File | null;
};

const initialData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  state: "",
  examBody: "",
  examBodyOther: "",
  examSubject: "",
  preferredDate: "",
  passportFile: null,
};

const steps = ["Personal details", "Exam selection", "Review & submit"];

const inputClass =
  "w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-signal)] focus:outline-none focus:ring-1 focus:ring-[var(--color-signal)]";
const labelClass = "mb-1.5 block text-sm font-medium text-[var(--color-ink)]";

const STORAGE_KEY = "soair-registration-progress";

type StoredData = Omit<FormData, "passportFile">;

function loadStoredProgress(): { data: StoredData; step: number } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function RegistrationForm() {
  const stored = loadStoredProgress();

  const [currentStep, setCurrentStep] = useState(stored?.step ?? 0);
  const [data, setData] = useState<FormData>(
    stored ? { ...initialData, ...stored.data } : initialData
  );
  const [submitted, setSubmitted] = useState(false);
  const [candidateNo] = useState(() => `2026${Math.floor(1000 + Math.random() * 9000)}`);

  useEffect(() => {
    const { passportFile, ...rest } = data;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data: rest, step: currentStep }));
  }, [data, currentStep]);

  const update = (field: keyof FormData, value: string | File | null) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailPattern.test(data.email);

  const canProceedStep0 =
    data.fullName && isEmailValid && data.phone && data.dob && data.gender && data.state;
  const canProceedStep1 =
    data.examBody &&
    (data.examBody !== "other" || data.examBodyOther.trim().length > 0) &&
    data.examSubject &&
    data.preferredDate;

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-signal)]/10 text-2xl text-[var(--color-signal)]">
          {"\u2713"}
        </div>
        <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Registration received</h2>
        <p className="mt-2 text-sm text-[var(--color-slate)]">
          Your candidate number has been generated. You'll receive your seat assignment by email once payment is confirmed.
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email address</label>
                <input
                  type="email"
                  className={`${inputClass} ${data.email && !isEmailValid ? "border-red-400" : ""}`}
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                {data.email && !isEmailValid && (
                  <p className="mt-1 text-xs text-red-500">Enter a valid email address</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Phone number</label>
                <input className={inputClass} value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="080..." />
              </div>
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
              <label className={labelClass}>Examination body</label>
              <select className={inputClass} value={data.examBody} onChange={(e) => update("examBody", e.target.value)}>
                <option value="">Select</option>
                <option value="jamb">JAMB (UTME)</option>
                <option value="noun">NOUN</option>
                <option value="waec">WAEC CBT</option>
                <option value="other">Other</option>
              </select>
              {data.examBody === "other" && (
                <input
                  className={`${inputClass} mt-3`}
                  value={data.examBodyOther}
                  onChange={(e) => update("examBodyOther", e.target.value)}
                  placeholder="Please specify the examination body"
                  autoFocus
                />
              )}
            </div>
            <div>
              <label className={labelClass}>Exam / subject combination</label>
              <input className={inputClass} value={data.examSubject} onChange={(e) => update("examSubject", e.target.value)} placeholder="e.g. Mathematics, English, Physics, Chemistry" />
            </div>
            <div>
              <label className={labelClass}>Preferred exam date</label>
              <input type="date" className={inputClass} value={data.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
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
              <div><dt className="text-[var(--color-slate)]">Email</dt><dd className="font-medium text-[var(--color-ink)]">{data.email || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Phone</dt><dd className="font-medium text-[var(--color-ink)]">{data.phone || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Date of birth</dt><dd className="font-medium text-[var(--color-ink)]">{data.dob || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Exam body</dt><dd className="font-medium text-[var(--color-ink)]">{data.examBody === "other" ? data.examBodyOther : data.examBody || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Subject(s)</dt><dd className="font-medium text-[var(--color-ink)]">{data.examSubject || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Preferred date</dt><dd className="font-medium text-[var(--color-ink)]">{data.preferredDate || "-"}</dd></div>
              <div><dt className="text-[var(--color-slate)]">Passport photo</dt><dd className="font-medium text-[var(--color-ink)]">{data.passportFile?.name || "Not uploaded"}</dd></div>
            </dl>
          </div>
        )}

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