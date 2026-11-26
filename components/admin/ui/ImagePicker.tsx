"use client";

import { useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";

const overlayButton =
  "inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold shadow-lg transition hover:bg-white disabled:opacity-60";

// Click or drag and drop. It only reports the chosen file; the form validates and uploads it.
export default function ImagePicker({
  src,
  fileName,
  disabled,
  error,
  onPick,
  onRemove,
}: {
  /** Preview URL; empty when there is no image */
  src: string;
  /** Set while a newly picked file is waiting to be saved */
  fileName?: string;
  disabled: boolean;
  error?: string;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const open = () => input.current?.click();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault(); // without this the browser would open the dropped file
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && !disabled) onPick(file);
      }}
    >
      <input
        ref={input}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // allows picking the same file again
          if (file) onPick(file);
        }}
      />

      {src ? (
        <div
          className={`relative h-48 overflow-hidden rounded-xl bg-slate-100 sm:h-56 dark:bg-slate-800 ${
            dragging ? "ring-4 ring-indigo-500/60" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Image preview" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 bg-gradient-to-t from-slate-950/80 to-transparent p-3 pt-10">
            <p className="min-w-0 flex-1 truncate text-xs font-medium text-white">
              {fileName ? `${fileName} · uploads when you save` : "Current image"}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={open} disabled={disabled} className={`${overlayButton} text-slate-800`}>
                <RefreshCw className="h-3.5 w-3.5" /> Change
              </button>
              <button type="button" onClick={onRemove} disabled={disabled} className={`${overlayButton} text-rose-600`}>
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          disabled={disabled}
          className={`flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 text-center transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:opacity-60 ${
            dragging
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
              : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-500/5"
          }`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-300">
            <ImagePlus className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Drag and drop an image, or <span className="text-indigo-600 dark:text-indigo-300">browse</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WebP or GIF, up to 10 MB</span>
        </button>
      )}

      {error && <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
