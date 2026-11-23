import { api, apiRequest } from "./client";

export interface Role {
  _id: string;
  name: string;
  description?: string;
  /** `resource:action` strings */
  permissions: string[];
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** GET /role/permissions: `grouped` maps resource -> actions, in registry order. */
export interface PermissionRegistry {
  permissions: string[];
  grouped: Record<string, string[]>;
}

export interface RolePayload {
  name: string;
  description?: string;
  permissions: string[];
}

export const rolesApi = {
  // limit=100: the role list is small and the UI shows it unpaginated.
  list: async (signal?: AbortSignal) =>
    (await apiRequest<Role[]>("/role?limit=100&sort=createdAt", { signal })).data,
  registry: (signal?: AbortSignal) => api.get<PermissionRegistry>("/role/permissions", signal),
  create: (payload: RolePayload) => api.post<Role>("/role", payload),
  update: (id: string, payload: Partial<RolePayload>) => api.patch<Role>(`/role/${id}`, payload),
  remove: (id: string) => api.delete<Role>(`/role/${id}`),
};
