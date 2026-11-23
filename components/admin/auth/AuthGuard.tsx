"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useCurrentUser } from "@/lib/auth/hooks";
import { ApiError } from "@/lib/api/types";

// Client-side guard for everything inside admin/(panel). The session is an httpOnly cookie
// the API sets, so we ask the API (/user/me) rather than inspecting cookies ourselves.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, error, refetch, isFetching } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  const signedOut = error instanceof ApiError && (error.status === 401 || error.status === 403);

  useEffect(() => {
    if (signedOut) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [signedOut, router, pathname]);

  if (user) return <>{children}</>;

  if (error && !signedOut) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <TriangleAlert className="mx-auto h-8 w-8 text-amber-500" />
          <h1 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">Can&apos;t load your session</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
          >
            {isFetching ? "Retrying…" : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950" role="status" aria-label="Loading">
      <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
    </div>
  );
}
