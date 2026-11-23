"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell } from "lucide-react";
import Dropdown from "./Dropdown";
import { notifications as initial } from "@/lib/admin/session";

export default function NotificationsMenu() {
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Dropdown
      label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
      width="w-80"
      closeOnClick={false}
      buttonClassName="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      button={
        <>
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />}
        </>
      }
    >
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</span>
        {/* TODO(api): persist read state */}
        <button
          type="button"
          onClick={() => setItems((l) => l.map((n) => ({ ...n, read: true })))}
          disabled={!unread}
          className="text-xs font-semibold text-indigo-600 hover:underline disabled:opacity-40 dark:text-indigo-400"
        >
          Mark all read
        </button>
      </div>
      <ul className="max-h-72 overflow-y-auto">
        {items.map((n) => (
          <li key={n.id}>
            <Link
              href={n.href}
              className="flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-indigo-500"}`} />
              <span className="min-w-0 flex-1">
                <span className="block text-slate-800 dark:text-slate-200">{n.text}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{n.time}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
