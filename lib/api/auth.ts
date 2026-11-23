import { api } from "./client";

export interface AuthRole {
  _id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
}

/** Shape of GET /user/me (role is populated there, unlike in the login response). */
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: AuthRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  // Tokens come back in the body too, but the server also sets httpOnly cookies, which is
  // what we rely on. Never store the tokens in JS.
  login: (payload: LoginPayload) => api.post<unknown>("/auth/login", payload),
  logout: () => api.post<null>("/auth/logout"),
  changePassword: (payload: ChangePasswordPayload) => api.post<null>("/auth/change-password", payload),
  updateMe: (payload: { name: string }) => api.patch<AuthUser>("/user/me", payload),
  me: ({ signal }: { signal?: AbortSignal } = {}) => api.get<AuthUser>("/user/me", signal),
};
