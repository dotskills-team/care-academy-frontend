"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi, type LoginPayload } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** The signed-in user (GET /user/me). Errors with ApiError 401 when there is no session. */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: ({ signal }) => authApi.me({ signal }),
    staleTime: 5 * 60_000,
  });
}

/**
 * Signs in, then loads /user/me into the cache (the login response has an unpopulated role,
 * so we don't use it). Callers react to the cache filling, e.g. by redirecting.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      await authApi.login(payload);
      try {
        await queryClient.fetchQuery({ queryKey: authKeys.me, queryFn: () => authApi.me(), staleTime: 0 });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          throw new ApiError(
            401,
            "Signed in, but your browser did not keep the session cookie. Check that cookies are enabled and the API URL is correct.",
          );
        }
        throw err;
      }
    },
  });
}

/** Returns a function that logs out, wipes cached data and goes to the login page. */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: authApi.logout,
    // Even if the request fails, the user asked to leave: drop local state either way.
    onSettled: () => {
      queryClient.removeQueries();
      router.replace("/login");
    },
  });

  return () => mutate();
}
