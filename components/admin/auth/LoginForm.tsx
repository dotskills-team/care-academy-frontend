"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CircleAlert, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { useCurrentUser, useLogin } from "@/lib/auth/hooks";
import { ApiError } from "@/lib/api/types";
import { safeNext } from "@/lib/auth/format";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = { email?: string; password?: string };

// `peer` + the icon placed after the input lets the icon react to focus.
const inputBase =
  "peer h-11 w-full rounded-xl border bg-white/70 pl-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:bg-slate-950";
const inputOk =
  "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15 dark:border-slate-700 dark:hover:border-slate-600";
const inputBad = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15";
const iconBase =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition peer-focus:text-indigo-500";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export default function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));

  // Already signed in (or just signed in): leave the login page. The login mutation fills
  // this query's cache, so this one effect covers both cases.
  const session = useCurrentUser();
  useEffect(() => {
    if (session.data) router.replace(next);
  }, [session.data, router, next]);

  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [clientErrors, setClientErrors] = useState<Fields>({});

  const serverError = login.error instanceof ApiError ? login.error : null;
  const errors: Fields = {
    email: clientErrors.email ?? serverError?.fieldMessage("email"),
    password: clientErrors.password ?? serverError?.fieldMessage("password"),
  };
  // Show the banner for anything that isn't already shown under a field.
  const banner = login.error && !errors.email && !errors.password ? (login.error as Error).message : null;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: Fields = {};
    if (!EMAIL_RE.test(email.trim())) found.email = "Enter a valid email address";
    if (!password) found.password = "Password is required";
    setClientErrors(found);
    if (found.email || found.password) return;

    login.mutate({ email: email.trim(), password });
  }

  // Full-page spinner only for the initial "already signed in?" check (before any submit).
  // Once the user submits, the form stays and only the button shows progress: signing in
  // refetches /user/me through this same query, flipping it to isPending / filling data,
  // which must not swap the form out.
  if (login.isIdle && (session.isPending || session.data)) {
    return (
      <div className="grid place-items-center py-14" role="status" aria-label="Loading">
        <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  // Keep the button spinning through the redirect that follows a successful login.
  const busy = login.isPending || login.isSuccess;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {banner && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          {banner}
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email address
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setClientErrors((c) => ({ ...c, email: undefined }));
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="you@careacademy.com"
            className={`${inputBase} pr-3 ${errors.email ? inputBad : inputOk}`}
          />
          <Mail className={iconBase} />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setClientErrors((c) => ({ ...c, password: undefined }));
            }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            placeholder="Enter your password"
            className={`${inputBase} pr-11 ${errors.password ? inputBad : inputOk}`}
          />
          <Lock className={iconBase} />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            Sign in <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
