"use client";

import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import Dropdown, { menuItemClass } from "./Dropdown";
import type { LucideIcon } from "lucide-react";

// Keep the key (and the resolve logic) in sync with the inline script in app/admin/layout.js.
type Theme = "light" | "dark" | "system";

const KEY = "care-admin-theme";
const options: { value: Theme; label: string; Icon: LucideIcon }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

function apply(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  return dark;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved: Theme = "system";
    try {
      const s = localStorage.getItem(KEY);
      if (s === "light" || s === "dark") saved = s;
    } catch {}
    setTheme(saved);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // While on "system", follow OS changes live.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(apply("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  function choose(value: Theme) {
    setTheme(value);
    setDark(apply(value));
    try {
      if (value === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, value);
    } catch {}
  }

  return (
    <Dropdown
      label="Change theme"
      width="w-40"
      buttonClassName="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      button={dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    >
      {options.map(({ value, label, Icon }) => (
        <button key={value} type="button" role="menuitemradio" aria-checked={theme === value} onClick={() => choose(value)} className={menuItemClass}>
          <Icon className="h-4 w-4" />
          {label}
          {theme === value && <Check className="ml-auto h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
        </button>
      ))}
    </Dropdown>
  );
}
