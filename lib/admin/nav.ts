import type { NavGroup, NavItem } from "./types";
// Sidebar structure. Add an item here and it appears in the sidebar.
// `href` must match a real route or the [section] placeholder (slug = last segment).
// TODO(auth): add `permission: "resource:action"` per item and filter by the user's role.
export const adminNav: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: "House" }],
  },
  {
    heading: "Website Content",
    items: [
      { label: "Countries", href: "/admin/countries", icon: "Globe" },
      { label: "Universities", href: "/admin/universities", icon: "Landmark" },
      { label: "Study Programs", href: "/admin/programs", icon: "Layers" },
      { label: "Articles", href: "/admin/articles", icon: "FileText" },
    ],
  },
  {
    heading: "Student Management",
    items: [{ label: "Inquiries", href: "/admin/inquiries", icon: "User" }],
  },
  {
    heading: "Administration",
    items: [
      { label: "Users", href: "/admin/users", icon: "Users" },
      { label: "Roles & Permissions", href: "/admin/roles", icon: "ShieldCheck" },
    ],
  },
];

// Routes reachable from the topbar menus but not listed in the sidebar.
const extraRoutes: NavItem[] = [
  { label: "My Profile", href: "/admin/profile" },
  { label: "Settings", href: "/admin/settings" },
];

export function findNavItem(slug: string | undefined) {
  return [...adminNav.flatMap((g) => g.items), ...extraRoutes].find((i) => i.href === `/admin/${slug}`);
}
