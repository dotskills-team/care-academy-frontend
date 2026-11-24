import Panel from "./Panel";
import type { TrendPoint } from "@/lib/admin/types";

// Dependency-free SVG area chart. Swap for a chart lib later if needed.
// Colors use Tailwind classes (not hex) so they follow the light/dark theme.
export default function InquiryTrendChart({ points }: { points: TrendPoint[] }) {
  const W = 520, H = 220, padL = 36, padR = 12, padT = 10, padB = 28;
  const max = Math.ceil(Math.max(...points.map((p) => p.value)) / 50) * 50;
  const x = (i: number) => padL + (i * (W - padL - padR)) / (points.length - 1);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${H - padB} L${x(0)},${H - padB} Z`;
  const ticks = Array.from({ length: max / 50 + 1 }, (_, i) => i * 50);

  return (
    <Panel title="Inquiry Trend" subtitle="Number of inquiries received over time" icon="ChartColumn">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Inquiry trend line chart">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={padL} x2={W - padR} y1={y(t)} y2={y(t)}
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize="10" className="fill-slate-500 dark:fill-slate-400">
              {t}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" strokeWidth="2" className="stroke-violet-600 dark:stroke-violet-400" />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle
              cx={x(i)} cy={y(p.value)} r="3.5" strokeWidth="2"
              className="fill-white stroke-violet-600 dark:fill-slate-900 dark:stroke-violet-400"
            />
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </Panel>
  );
}
