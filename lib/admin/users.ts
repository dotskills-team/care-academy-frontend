"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi, type CreateUserPayload, type UpdateUserPayload, type UserListParams } from "@/lib/api/users";
import { authKeys } from "@/lib/auth/hooks";
import { roleKeys } from "@/lib/admin/roles";

export const userKeys = {
  all: ["users"] as const,
  stats: ["users", "stats"] as const,
  list: (p: UserListParams) => ["users", "list", p] as const,
};

export const useUsers = (params: UserListParams) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => usersApi.list(params, signal),
    placeholderData: keepPreviousData,
  });

export const useUserStats = () =>
  useQuery({ queryKey: userKeys.stats, queryFn: ({ signal }) => usersApi.stats(signal) });

function useUserMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      // Editing yourself (e.g. your name) changes /user/me too.
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      // Role deletion is blocked while users hold the role, so keep that view fresh.
      queryClient.invalidateQueries({ queryKey: roleKeys.list });
    },
  });
}

export const useCreateUser = () => useUserMutation((p: CreateUserPayload) => usersApi.create(p));
export const useUpdateUser = () =>
  useUserMutation(({ id, payload }: { id: string; payload: UpdateUserPayload }) => usersApi.update(id, payload));
export const useDeleteUser = () => useUserMutation((id: string) => usersApi.remove(id));

/** Mirrors the server's escalation rule (isStrictSubset in role.service.ts). */
export function isStrictSubset(subset: string[], superset: string[]) {
  const sup = new Set(superset);
  return new Set(subset).size < sup.size && subset.every((p) => sup.has(p));
}
