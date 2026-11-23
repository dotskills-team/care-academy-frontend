import { api, apiRequest } from "./client";
import type { ApiMeta } from "./types";

export interface UserRole {
  _id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
}

/** A row from GET /user (role is populated; the password is never returned). */
export interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface UserListMeta extends ApiMeta {
  page: number;
  limit: number;
  totalPage: number;
}

export interface UserListParams {
  page: number;
  limit: number;
  searchTerm?: string;
  role?: string;
  /** "true" | "false" | undefined (all) */
  isActive?: string;
}

/** GET /user/stats */
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  superAdmin: number;
  admin: number;
  editor: number;
  counsellor: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export type UpdateUserPayload = Partial<Pick<CreateUserPayload, "name" | "email" | "role">> & {
  isActive?: boolean;
};

function toQuery(p: UserListParams) {
  const q = new URLSearchParams({ page: String(p.page), limit: String(p.limit) });
  if (p.searchTerm?.trim()) q.set("searchTerm", p.searchTerm.trim());
  if (p.role) q.set("role", p.role);
  if (p.isActive) q.set("isActive", p.isActive);
  return q.toString();
}

export const usersApi = {
  list: async (params: UserListParams, signal?: AbortSignal) => {
    const res = await apiRequest<ManagedUser[]>(`/user?${toQuery(params)}`, { signal });
    return { users: res.data, meta: res.meta as UserListMeta };
  },
  stats: (signal?: AbortSignal) => api.get<UserStats>("/user/stats", signal),
  create: (payload: CreateUserPayload) => api.post<ManagedUser>("/user", payload),
  update: (id: string, payload: UpdateUserPayload) => api.patch<ManagedUser>(`/user/${id}`, payload),
  remove: (id: string) => api.delete<ManagedUser>(`/user/${id}`),
};
