import Panel from "./Panel";
import type { StatusSlice } from "@/lib/admin/types";

export default function StatusDonut({ total, items }: { total: number; items: StatusSlice[] }) {
  const R = 52, C = 2 * Math.PI * R;
  const sum = items.reduce((a, i) => a + i.value, 0);
  let offset = 0;

  return (
    <Panel title="Inquiry Status Overview" subtitle="Distribution of inquiries by current status" icon="ClipboardList">
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" role="img" aria-label="Inquiry status donut chart">
            {items.map((i) => {
              const len = (i.value / sum) * C;
              const el = (
                <circle
                  key={i.label}
                  cx="70" cy="70" r={R}
                  fill="none" stroke={i.color} strokeWidth="18"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{total.toLocaleString("en-US")}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Inquiries</div>
            </div>
          </div>
        </div>
        <ul className="min-w-[160px] flex-1 space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: i.color }} />
              <span className="font-medium text-slate-700 dark:text-slate-200">{i.label}</span>
              <span className="ml-auto text-slate-500 dark:text-slate-400">
                {i.value} ({((i.value / sum) * 100).toFixed(1)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
