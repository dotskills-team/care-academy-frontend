// Shared by the server-side fetchers of public data.

// The server needs an absolute URL. With the production proxy NEXT_PUBLIC_API_URL is
// relative ("/api/v1"), so the backend origin comes from API_PROXY_TARGET.
export function apiBase(): string {
  const configured = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1").replace(/\/+$/, "");
  const absolute = /^https?:\/\//.test(configured)
    ? configured
    : `${(process.env.API_PROXY_TARGET ?? "").replace(/\/+$/, "")}${configured}`;
  return absolute.endsWith("/api/v1") ? absolute : `${absolute}/api/v1`;
}

// Public pages show live data: every request asks the API again, nothing is cached
export const liveFetch = (path: string) => fetch(`${apiBase()}${path}`, { cache: "no-store" });

// Uploaded files live on the API origin; "/images/..." paths are in this app's public folder
export function resolveImage(path: string): string {
  return path.startsWith("/uploads/") ? `${new URL(apiBase()).origin}${path}` : path;
}
