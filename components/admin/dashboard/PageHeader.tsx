"use client";

import { useCurrentUser } from "@/lib/auth/hooks";
import { formatRole } from "@/lib/auth/format";
import RefreshButton from "./RefreshButton";

export default function PageHeader({ lastUpdated }: { lastUpdated: string }) {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back{user ? `, ${user.name}` : ""}!
          {user && (
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
              {formatRole(user.role.name)}
            </span>
          )}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s what&apos;s happening at CARE Academy — inquiries, content, and platform performance at a glance.
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span>Last updated: {lastUpdated}</span>
        <RefreshButton />
      </div>
    </div>
  );
}
