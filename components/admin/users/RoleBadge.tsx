import { Crown, Headset, PenLine, ShieldCheck, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatRole } from "@/lib/auth/format";

// Full class strings so Tailwind can see them. Unknown (custom) roles use the neutral style.
const styles: Record<string, { Icon: LucideIcon; cls: string }> = {
  SUPER_ADMIN: { Icon: Crown, cls: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300" },
  ADMIN: { Icon: ShieldCheck, cls: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300" },
  EDITOR: { Icon: PenLine, cls: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300" },
  COUNSELLOR: { Icon: Headset, cls: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300" },
};
const fallback = {
  Icon: UserRound,
  cls: "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function RoleBadge({ name }: { name: string }) {
  const { Icon, cls } = styles[name] ?? fallback;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      <Icon className="h-3.5 w-3.5" /> {formatRole(name)}
    </span>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
