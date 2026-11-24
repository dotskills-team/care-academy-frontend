"use client";

import { useEffect, useRef, useState } from "react";

// Shared item style for menu rows (links or buttons) inside <Dropdown>.
export const menuItemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800";

interface DropdownProps {
  button: React.ReactNode;
  label: string;
  buttonClassName?: string;
  width?: string;
  align?: "left" | "right";
  up?: boolean;
  closeOnClick?: boolean;
  children: React.ReactNode;
}

// Click-to-open popover. Closes on outside click, Escape, and (by default) on any click inside.
export default function Dropdown({
  button,
  label,
  buttonClassName = "",
  width = "w-56",
  align = "right",
  up = false,
  closeOnClick = true,
  children,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={buttonClassName}
      >
        {button}
      </button>
      {open && (
        <div
          role="menu"
          onClick={closeOnClick ? () => setOpen(false) : undefined}
          className={`absolute z-50 ${up ? "bottom-full mb-2" : "mt-2"} ${
            align === "right" ? "right-0" : "left-0"
          } ${width} rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
