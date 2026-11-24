"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogOut, X } from "lucide-react";
import Icon from "@/components/Icon";
import { adminNav } from "@/lib/admin/nav";
import { useLogout } from "@/lib/auth/hooks";

export default function Sidebar({
  open,
  hidden,
  animate,
  onClose,
}: {
  open: boolean;
  hidden: boolean;
  animate: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#0b1437] text-slate-300 ${
          animate ? "transition-transform duration-200" : ""
        } ${open ? "translate-x-0" : "-translate-x-full"} ${hidden ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 text-white">
            <GraduationCap className="h-8 w-8" />
            <span className="leading-tight">
              <span className="block text-lg font-bold">CARE Academy</span>
              <span className="block text-[10px] text-slate-400">International Education Consultancy</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {adminNav.map((group) => (
            <div key={group.heading}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.heading}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          active ? "bg-indigo-600 text-white" : "hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon name={item.icon} className="h-[18px] w-[18px]" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <button onClick={logout} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-white/5">
          <LogOut className="h-[18px] w-[18px]" /> Logout
        </button>
      </aside>
    </>
  );
}
