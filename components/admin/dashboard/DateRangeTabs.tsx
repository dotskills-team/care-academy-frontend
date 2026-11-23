"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Dropdown from "@/components/admin/layout/Dropdown";

const ranges = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

const dateInput =
  "w-full rounded-lg border border-slate-200 bg-transparent px-2 py-1.5 text-sm text-slate-800 dark:border-slate-700 dark:text-slate-200 dark:[color-scheme:dark]";

// TODO(api): lift into the URL (?range=7d or ?from=&to=) so the server component can refetch.
export default function DateRangeTabs() {
  const [active, setActive] = useState("7d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="inline-flex flex-wrap items-center rounded-xl border border-slate-200 bg-white p-0.5 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {ranges.map((r) => (
        <button
          key={r.key}
          onClick={() => setActive(r.key)}
          className={`rounded-lg px-4 py-1.5 font-medium transition ${
            active === r.key
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          {r.label}
        </button>
      ))}
      <Dropdown
        label="Custom date range"
        width="w-64"
        align="left"
        closeOnClick={false}
        buttonClassName={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 font-medium transition ${
          active === "custom"
            ? "bg-indigo-600 text-white"
            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
        button={
          <>
            Custom <ChevronDown className="h-4 w-4" />
          </>
        }
      >
        <div className="space-y-3 p-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
            From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${dateInput} mt-1`} />
          </label>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
            To
            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={`${dateInput} mt-1`} />
          </label>
          <button
            type="button"
            disabled={!from || !to}
            onClick={() => setActive("custom")}
            className="w-full rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
