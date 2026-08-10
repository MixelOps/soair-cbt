import { useEffect, useRef, useState } from "react";

type PassportUploadProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export function PassportUpload({ file, onChange }: PassportUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFiles = (files: FileList | null) => {
    onChange(files?.[0] ?? null);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!previewUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-8 text-center transition-colors hover:border-[var(--color-signal)] hover:bg-[var(--color-signal)]/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--color-signal)]">
              <path d="M12 16V4M12 4L7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--color-ink)]">Click to upload, or drag a photo here</p>
          <p className="text-xs text-[var(--color-slate)]">Passport-style photo · JPG or PNG</p>
        </button>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <img
            src={previewUrl}
            alt="Passport preview"
            className="h-20 w-16 rounded-md border border-slate-200 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--color-ink)]">{file?.name}</p>
            <p className="text-xs text-[var(--color-signal)]">Photo selected</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:bg-slate-50"
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-medium text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}