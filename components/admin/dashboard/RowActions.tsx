"use client";

import Link from "next/link";
import { Ellipsis, Eye, PhoneCall, CircleCheck } from "lucide-react";
import Dropdown, { menuItemClass } from "@/components/admin/layout/Dropdown";
import type { RecentInquiry } from "@/lib/admin/types";

// `up` opens the menu above the button (needed for the last rows, since the table scrolls horizontally).
export default function RowActions({ inquiry, up }: { inquiry: RecentInquiry; up?: boolean }) {
  return (
    <Dropdown
      label={`Actions for ${inquiry.name}`}
      width="w-48"
      up={up}
      buttonClassName="rounded-lg border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      button={<Ellipsis className="h-4 w-4" />}
    >
      <Link href="/admin/inquiries" className={menuItemClass}><Eye className="h-4 w-4" /> View details</Link>
      {/* TODO(api): call the inquiry status endpoints */}
      <button type="button" className={menuItemClass}><PhoneCall className="h-4 w-4" /> Mark as contacted</button>
      <button type="button" className={menuItemClass}><CircleCheck className="h-4 w-4" /> Close inquiry</button>
    </Dropdown>
  );
}
