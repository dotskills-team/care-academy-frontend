"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((item, i) => (
        <div key={i} className={`overflow-hidden rounded-2xl border bg-white transition ${open === i ? "border-accent-500 shadow-md" : "border-slate-200"}`}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="font-semibold text-slate-900">{item.q}</span>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${open === i ? "bg-accent-500 text-slate-900" : "bg-brand-50 text-brand-600"}`}>
              {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </span>
          </button>
          {open === i && <div className="px-6 pb-5 leading-relaxed text-slate-600">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}
