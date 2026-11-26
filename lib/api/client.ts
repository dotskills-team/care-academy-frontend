import { ApiError, type ApiEnvelope } from "./types";

// NEXT_PUBLIC_API_URL is the full API base, e.g. http://localhost:5002/api/v1.
// A bare origin (http://localhost:5002) also works: /api/v1 is appended if missing.
const RAW = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1").replace(/\/+$/, "");
export const API_BASE = RAW.endsWith("/api/v1") ? RAW : `${RAW}/api/v1`;

/**
 * Browser URL for a stored image path. "/uploads/..." lives on the API origin (with the
 * production proxy API_BASE is relative and next.config.js rewrites /uploads instead).
 */
export function assetUrl(path: string): string {
  if (path.startsWith("/uploads/") && /^https?:\/\//.test(API_BASE)) {
    return `${new URL(API_BASE).origin}${path}`;
  }
  return path;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

// One in-flight refresh shared by all requests that hit a 401 at the same time.
let refreshing: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = fetch(`${API_BASE}/auth/refresh-token`, { method: "POST", credentials: "include" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

/**
 * Low-level request: returns the full envelope (data + meta). Auth is the httpOnly
 * cookie set by the server, so every call sends credentials. On a 401 from a non-auth
 * route it tries one silent token refresh, then replays the request once.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, signal }: RequestOptions = {},
  canRetry = true,
): Promise<ApiEnvelope<T>> {
  // FormData is sent as is: the browser sets the multipart header with its boundary
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const isJson = body !== undefined && !isForm;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: "include",
      headers: isJson ? { "Content-Type": "application/json" } : undefined,
      body: isForm ? (body as FormData) : isJson ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again.");
  }

  if (res.status === 401 && canRetry && !path.startsWith("/auth/") && (await refreshSession())) {
    return apiRequest<T>(path, { method, body, signal }, false);
  }

  const json = (await res.json().catch(() => null)) as Partial<ApiEnvelope<T>> & {
    errorSources?: ApiError["errorSources"];
  } | null;

  if (!res.ok) {
    throw new ApiError(res.status, json?.message ?? res.statusText ?? "Request failed", json?.errorSources ?? []);
  }
  return json as ApiEnvelope<T>;
}

/** Convenience wrappers that return just `data`. Use `apiRequest` when you need `meta`. */
export const api = {
  get: <T>(path: string, signal?: AbortSignal) => apiRequest<T>(path, { signal }).then((r) => r.data),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", body }).then((r) => r.data),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PATCH", body }).then((r) => r.data),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }).then((r) => r.data),
};
