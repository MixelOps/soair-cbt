type StepIndicatorProps = {
  steps: string[];
  currentStep: number; // 0-indexed
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-10 flex items-center">
      {steps.map((label, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-medium ${
                  isComplete
                    ? "bg-[var(--color-signal)] text-white"
                    : isCurrent
                    ? "border-2 border-[var(--color-signal)] text-[var(--color-signal)]"
                    : "border border-slate-300 text-[var(--color-slate)]"
                }`}
              >
                {isComplete ? "✓" : index + 1}
              </div>
              <span
                className={`mt-2 text-xs ${
                  isCurrent ? "font-medium text-[var(--color-ink)]" : "text-[var(--color-slate)]"
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-3 h-px flex-1 ${
                  isComplete ? "bg-[var(--color-signal)]" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}