"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink, LogOut, Settings, User } from "lucide-react";
import Dropdown, { menuItemClass } from "./Dropdown";
import { useCurrentUser, useLogout } from "@/lib/auth/hooks";
import { formatRole, initials } from "@/lib/auth/format";

export default function UserMenu() {
  const logout = useLogout();
  const { data: user } = useCurrentUser();
  if (!user) return null; // AuthGuard guarantees a user; this only narrows the type

  return (
    <Dropdown
      label="Account menu"
      width="w-60"
      buttonClassName="flex items-center gap-2.5 rounded-lg p-1 pr-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
      button={
        <>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            {initials(user.name)}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{user.name}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">{formatRole(user.role.name)}</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
        </>
      }
    >
      <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>
      <div className="py-1">
        <Link href="/admin/profile" className={menuItemClass}><User className="h-4 w-4" /> My Profile</Link>
        <Link href="/admin/settings" className={menuItemClass}><Settings className="h-4 w-4" /> Settings</Link>
        <Link href="/" target="_blank" className={menuItemClass}><ExternalLink className="h-4 w-4" /> View public site</Link>
      </div>
      <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
        <button type="button" onClick={logout} className={`${menuItemClass} text-rose-600 dark:text-rose-400`}>
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </Dropdown>
  );
}
