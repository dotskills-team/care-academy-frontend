"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

// Sonner's own "system" theme follows the OS, but the admin theme is the `dark` class on
// <html> (set by ThemeScript / ThemeToggle), so watch that class instead.
export default function AppToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setTheme(el.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return <Toaster position="top-center" theme={theme} richColors closeButton />;
}
