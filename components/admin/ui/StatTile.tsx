import type { LucideIcon } from "lucide-react";

// Full class strings so Tailwind can see them.
const tones = {
  indigo: { card: "border-indigo-200 bg-indigo-50 dark:border-indigo-500/25 dark:bg-indigo-500/10", bar: "bg-indigo-500", chip: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300", text: "text-indigo-600 dark:text-indigo-300" },
  emerald: { card: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10", bar: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300", text: "text-emerald-600 dark:text-emerald-300" },
  violet: { card: "border-violet-200 bg-violet-50 dark:border-violet-500/25 dark:bg-violet-500/10", bar: "bg-violet-500", chip: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300", text: "text-violet-600 dark:text-violet-300" },
  sky: { card: "border-sky-200 bg-sky-50 dark:border-sky-500/25 dark:bg-sky-500/10", bar: "bg-sky-500", chip: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300", text: "text-sky-600 dark:text-sky-300" },
  amber: { card: "border-amber-200 bg-amber-50 dark:border-amber-500/25 dark:bg-amber-500/10", bar: "bg-amber-500", chip: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300", text: "text-amber-600 dark:text-amber-300" },
  rose: { card: "border-rose-200 bg-rose-50 dark:border-rose-500/25 dark:bg-rose-500/10", bar: "bg-rose-500", chip: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300", text: "text-rose-600 dark:text-rose-300" },
};

export interface StatCardData {
  label: string;
  hint: string;
  value: number;
  icon: LucideIcon;
  tone: keyof typeof tones;
}

/** A count with its share of `total`, used above the admin tables. */
export default function StatTile({ card, total, loading }: { card: StatCardData; total: number; loading: boolean }) {
  const t = tones[card.tone];
  const share = total > 0 ? Math.round((card.value / total) * 100) : 0;
  const Icon = card.icon;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${t.card}`}>
      {/* oversized watermark icon */}
      <Icon className={`pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 opacity-[0.07] ${t.text}`} aria-hidden="true" />

      <div className="relative flex items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${t.chip}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">{card.label}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{card.hint}</p>
        </div>
      </div>

      <div className="relative mt-4 flex items-end justify-between">
        {loading ? (
          <span className="h-9 w-14 animate-pulse rounded-md bg-white/70 dark:bg-slate-800" />
        ) : (
          <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{card.value}</span>
        )}
        {!loading && <span className={`text-xs font-semibold ${t.text}`}>{share}%</span>}
      </div>

      {/* share-of-total meter */}
      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/70 dark:bg-slate-800" aria-hidden="true">
        <div className={`h-full rounded-full ${t.bar} transition-all duration-500`} style={{ width: `${loading ? 0 : share}%` }} />
      </div>
    </div>
  );
}
