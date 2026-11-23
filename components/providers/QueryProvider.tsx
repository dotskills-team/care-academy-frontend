"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError } from "@/lib/api/types";
import { authKeys } from "@/lib/auth/hooks";

function makeClient() {
  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      // A 401 on any data query means the session died mid-use: re-check /user/me so the
      // AuthGuard sends the user to the login page. (Skip the me query itself to avoid a loop.)
      onError: (error, query) => {
        if (error instanceof ApiError && error.status === 401 && query.queryKey[0] !== authKeys.me[0]) {
          client.invalidateQueries({ queryKey: authKeys.me });
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        // Don't retry client errors (bad input, 401, 403, 404); retry network/5xx twice.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 2,
      },
    },
  });
  return client;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState so each browser session gets one client (and SSR never shares one across requests).
  const [client] = useState(makeClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
