"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const KEY = "care-admin-sidebar"; // "hidden" when the desktop sidebar is collapsed
const LG = 1024; // Tailwind `lg` breakpoint

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [hidden, setHidden] = useState(false); // desktop show/hide
  const [ready, setReady] = useState(false); // enables transitions only after the saved state is applied

  useEffect(() => {
    try {
      setHidden(localStorage.getItem(KEY) === "hidden");
    } catch {}
    setReady(true);
  }, []);

  function toggle() {
    if (window.innerWidth < LG) {
      setMobileOpen((o) => !o);
      return;
    }
    const next = !hidden;
    setHidden(next);
    try {
      if (next) localStorage.setItem(KEY, "hidden");
      else localStorage.removeItem(KEY);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Sidebar open={mobileOpen} hidden={hidden} animate={ready} onClose={() => setMobileOpen(false)} />
      <div className={`${ready ? "transition-[padding] duration-200" : ""} ${hidden ? "lg:pl-0" : "lg:pl-60"}`}>
        <Topbar onToggleSidebar={toggle} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

