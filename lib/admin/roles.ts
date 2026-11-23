"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesApi, type RolePayload } from "@/lib/api/roles";
import { authKeys } from "@/lib/auth/hooks";

export const roleKeys = {
  all: ["roles"] as const,
  list: ["roles", "list"] as const,
  registry: ["roles", "registry"] as const,
};

export const useRoles = () =>
  useQuery({ queryKey: roleKeys.list, queryFn: ({ signal }) => rolesApi.list(signal) });

// The registry only changes when the server is redeployed.
export const usePermissionRegistry = () =>
  useQuery({
    queryKey: roleKeys.registry,
    queryFn: ({ signal }) => rolesApi.registry(signal),
    staleTime: 30 * 60_000,
  });

/** Role changes can alter the signed-in user's own permissions, so refresh /user/me too. */
function useRoleMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.list });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export const useCreateRole = () => useRoleMutation((payload: RolePayload) => rolesApi.create(payload));

export const useUpdateRole = () =>
  useRoleMutation(({ id, payload }: { id: string; payload: Partial<RolePayload> }) =>
    rolesApi.update(id, payload),
  );

export const useDeleteRole = () => useRoleMutation((id: string) => rolesApi.remove(id));
