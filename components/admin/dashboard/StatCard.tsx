import { ArrowUpRight, Minus } from "lucide-react";
import Icon from "@/components/Icon";
import type { DashboardStat, Tone } from "@/lib/admin/types";

// Full class strings so Tailwind can see them.
const tones: Record<Tone, { card: string; badge: string }> = {
  violet: {
    card: "bg-violet-50 border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20",
    badge: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
  },
  sky: {
    card: "bg-sky-50 border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20",
    badge: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
  },
  amber: {
    card: "bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
    badge: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  },
  emerald: {
    card: "bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    badge: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  rose: {
    card: "bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20",
    badge: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
  },
  indigo: {
    card: "bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20",
    badge: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
  },
};

export default function StatCard({ label, value, change, icon, tone = "violet" }: Omit<DashboardStat, "key">) {
  const t = tones[tone] ?? tones.violet;
  const flat = change === 0;

  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-4 ${t.card}`}>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${t.badge}`}>
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        <div className="mt-1 flex items-end justify-between gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value.toLocaleString("en-US")}</span>
          <span className="text-right text-[11px] text-slate-500 dark:text-slate-400">
            <span
              className={`flex items-center justify-end gap-0.5 text-sm font-semibold ${
                flat ? "text-slate-500 dark:text-slate-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {flat ? <Minus className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
              {change.toFixed(1)}%
            </span>
            vs. previous 7 days
          </span>
        </div>
      </div>
    </div>
  );
}
