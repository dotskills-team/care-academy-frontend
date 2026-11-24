"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { nav, site } from "@/lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label={site.fullName}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-brand-600">
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={`tel:${site.phone}`} className="btn-accent hidden xl:inline-flex">
          <Phone className="h-4 w-4" /> {site.phone}
        </a>

        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 xl:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {item.label}
              </Link>
            ))}
            <a href={`tel:${site.phone}`} className="btn-accent mt-2"><Phone className="h-4 w-4" /> {site.phone}</a>
          </div>
        </div>
      )}
    </header>
  );
}
