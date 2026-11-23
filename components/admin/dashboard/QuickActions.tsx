import Link from "next/link";
import Icon from "@/components/Icon";
import Panel from "./Panel";
import type { QuickAction as QuickActionItem } from "@/lib/admin/types";

export default function QuickActions({ actions }: { actions: QuickActionItem[] }) {
  return (
    <Panel title="Quick Actions" icon="Zap">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 px-2 py-4 text-center text-xs font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10"
          >
            <Icon name={a.icon} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            {a.label}
          </Link>
        ))}
      </div>
    </Panel>
  );
}
