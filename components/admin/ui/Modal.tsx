"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  title,
  onClose,
  size = "max-w-md",
  subtitle,
  icon,
  footer,
  children,
}: {
  title: string;
  onClose: () => void;
  /** Tailwind max-width class for the dialog */
  size?: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  /** With a footer, the header and footer stay in place and only the body scrolls */
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pinned = !!footer;

  return (
    <div
      className={`fixed inset-0 z-[60] grid place-items-center overflow-y-auto p-4 ${
        pinned ? "bg-slate-950/60 backdrop-blur-sm" : "bg-slate-900/50"
      }`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${size} rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${
          pinned ? "flex max-h-[calc(100vh-2rem)] animate-fade flex-col overflow-hidden shadow-2xl" : "p-5 shadow-xl"
        }`}
      >
        <div
          className={`flex items-center justify-between gap-3 ${
            pinned ? "border-b border-slate-100 px-6 py-4 dark:border-slate-800" : "mb-4"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            {icon && (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h2 className={`truncate font-bold text-slate-900 dark:text-slate-100 ${pinned ? "text-lg" : "text-base"}`}>
                {title}
              </h2>
              {subtitle && <p className="truncate text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {pinned ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-6 dark:bg-slate-950/40">
              {children}
            </div>
            <div className="border-t border-slate-100 px-4 py-4 sm:px-6 dark:border-slate-800">{footer}</div>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
