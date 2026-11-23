"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Menu, Search } from "lucide-react";
import { findNavItem } from "@/lib/admin/nav";
import ThemeToggle from "./ThemeToggle";
import NotificationsMenu from "./NotificationsMenu";
import UserMenu from "./UserMenu";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];
  const label = findNavItem(slug)?.label ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      <button
        onClick={onToggleSidebar}
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav className="hidden items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 sm:flex" aria-label="Breadcrumb">
        <Link href="/admin/dashboard" className="hover:text-slate-800 dark:hover:text-white">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-700 dark:text-slate-200">{label}</span>
      </nav>

      <div className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400 dark:border-slate-700 md:flex">
        <Search className="h-4 w-4" />
        <input
          type="search"
          placeholder="Search universities, inquiries, content..."
          className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <NotificationsMenu />
        <div className="ml-1 border-l border-slate-200 pl-3 dark:border-slate-700">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
