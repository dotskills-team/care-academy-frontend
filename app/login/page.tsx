import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, FileText, GraduationCap, Inbox, ShieldCheck, TrendingUp, Users } from "lucide-react";
import LoginForm from "@/components/admin/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const features = [
  { icon: Inbox, title: "Inquiry pipeline", text: "Track every student inquiry from first contact to closed." },
  { icon: FileText, title: "Content management", text: "Universities, programs, countries and articles in one place." },
  { icon: Users, title: "Roles & permissions", text: "Give each team member exactly the access they need." },
];

// Decorative only: a static sparkline for the glass card on the brand panel.
const sparkline = "M0,38 L18,30 L36,34 L54,22 L72,26 L90,14 L108,18 L126,6";

// Public URL: /login. Outside admin/(panel), so no sidebar/topbar and no AuthGuard.
export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ───────── Brand panel ───────── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#070d2b] p-12 text-white lg:flex">
        {/* Background: glow blobs + fine grid, faded toward the edges */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/40 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-tight">CARE Academy</span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-indigo-200/70">Admin Console</span>
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-[1.15] tracking-tight">
            Run your consultancy with{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              clarity and speed.
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300/80">
            Everything your team needs to guide students abroad, managed from a single dashboard.
          </p>

          <ul className="mt-9 space-y-5">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-indigo-200 ring-1 ring-white/10">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{title}</span>
                  <span className="block text-sm text-slate-400">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-end justify-between gap-6">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} CARE Academy. All rights reserved.</p>
          {/* Decorative glass card */}
          <div
            aria-hidden="true"
            className="w-52 rounded-2xl bg-white/[0.06] p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-md"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Weekly inquiries</span>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <svg viewBox="0 0 126 44" className="mt-3 h-10 w-full">
              <defs>
                <linearGradient id="loginSpark" x1="0" x2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#e879f9" />
                </linearGradient>
              </defs>
              <path d={sparkline} fill="none" stroke="url(#loginSpark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </aside>

      {/* ───────── Form panel ───────── */}
      <main className="relative flex items-center justify-center overflow-hidden bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-400/20 blur-[100px] dark:bg-indigo-600/20" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-400/15 blur-[100px] dark:bg-violet-600/15" />

        <div className="animate-fade relative w-full max-w-[26rem]">
          <div className="mb-7 flex items-center gap-2.5 text-slate-900 dark:text-slate-100 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">CARE Academy</span>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_24px_60px_-20px_rgba(49,46,129,0.25)] ring-1 ring-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/40 dark:ring-white/5 sm:p-9">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h1 className="mt-5 text-[1.65rem] font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
            <p className="mb-8 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Sign in to your admin account to continue.
            </p>

            {/* useSearchParams (the ?next= redirect) needs a Suspense boundary. */}
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to website
            </Link>
            <span className="text-xs text-slate-400 dark:text-slate-500">Authorized staff only</span>
          </div>
        </div>
      </main>
    </div>
  );
}
