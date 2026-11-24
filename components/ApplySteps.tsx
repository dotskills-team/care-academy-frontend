import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/Icon";
import { applySteps } from "@/lib/home";

// Winding "snake" journey.
//  - lg+: two rows of 5 on a wavy dashed path; row 2 runs right-to-left, joined by a U-turn.
//  - below lg: single column, cards alternate left/right joined by curved dashed connectors.

const dash: React.CSSProperties = { strokeDasharray: "7 7", vectorEffect: "non-scaling-stroke" };

function Node({ n, icon }: { n: number; icon: string }) {
  return (
    <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent-500 text-slate-900 shadow-[0_0_0_7px_rgba(229,169,18,0.22)]">
      <Icon name={icon} className="h-6 w-6" />
      <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brand-900 text-[11px] font-bold text-accent-300 ring-2 ring-accent-500">
        {n}
      </span>
    </span>
  );
}

function WaveRow({ steps, start, reverse }: { steps: { title: string; icon: string }[]; start: number; reverse?: boolean }) {
  return (
    <div className="relative h-[220px]">
      <svg className="absolute inset-x-0 top-0 h-[120px] w-full" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M100 30 C200 30 200 90 300 90 C400 90 400 30 500 30 C600 30 600 90 700 90 C800 90 800 30 900 30"
          fill="none" stroke="#E5A912" strokeWidth="2" style={dash} opacity="0.8"
        />
      </svg>
      <ol className={`absolute inset-0 grid grid-cols-5 ${reverse ? "[direction:rtl]" : ""}`}>
        {steps.map((st, k) => (
          <li key={st.title} className="flex flex-col items-center text-center [direction:ltr]" style={{ paddingTop: k % 2 ? 62 : 2 }}>
            <Node n={start + k} icon={st.icon} />
            <p className="mt-4 max-w-[10.5rem] text-sm font-semibold leading-snug">{st.title}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ApplySteps() {
  const row1 = applySteps.slice(0, 5);
  const row2 = applySteps.slice(5, 10);

  return (
    <section className="section relative overflow-hidden bg-brand-900 text-white">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="container relative">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-[2.5rem] md:leading-tight">Easy Steps to Apply</h2>
          <p className="mt-4 text-brand-100">Ten clear steps from your first conversation to your first day abroad.</p>
        </div>

        {/* Desktop: winding rows */}
        <div className="mx-auto hidden max-w-6xl lg:block">
          <WaveRow steps={row1} start={1} />
          {/* U-turn from step 5 (right) down to step 6 (right) */}
          <div className="relative h-16">
            <svg className="absolute right-[7%] top-[-52px] h-[120px] w-16" viewBox="0 0 60 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 0 C60 8 60 112 0 120" fill="none" stroke="#E5A912" strokeWidth="2" style={dash} opacity="0.8" />
            </svg>
          </div>
          <WaveRow steps={row2} start={6} reverse />
        </div>

        {/* Mobile / tablet: winding column */}
        <ol className="mx-auto max-w-md lg:hidden">
          {applySteps.map((st, i) => {
            const left = i % 2 === 0;
            return (
              <li key={st.title}>
                <div className={`flex ${left ? "justify-start" : "justify-end"}`}>
                  <div className="flex w-[88%] items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <Node n={i + 1} icon={st.icon} />
                    <h3 className="text-sm font-semibold leading-snug">{st.title}</h3>
                  </div>
                </div>
                {i < applySteps.length - 1 && (
                  <svg className="block h-12 w-full" viewBox="0 0 100 48" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      d={left ? "M14 0 C14 30 86 18 86 48" : "M86 0 C86 30 14 18 14 48"}
                      fill="none" stroke="#E5A912" strokeWidth="2" style={dash} opacity="0.8"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-14 text-center">
          <Link href="/#consultation-booking-form" className="btn-accent px-7 py-3.5 text-base">
            Start with a Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
