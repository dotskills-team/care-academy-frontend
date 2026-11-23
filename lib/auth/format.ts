/** "SUPER_ADMIN" -> "Super Admin" */
export function formatRole(name: string): string {
  return name
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

/** Only allow in-app admin paths as post-login targets (blocks open redirects). */
export function safeNext(next: string | null): string {
  if (next && next.startsWith("/admin") && !next.startsWith("//")) {
    return next;
  }
  return "/admin/dashboard";
}
