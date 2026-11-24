import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Panel from "./Panel";
import RowActions from "./RowActions";
import StatusBadge from "./StatusBadge";
import type { RecentInquiry } from "@/lib/admin/types";

const initials = (name: string) => name.split(" ").map((p) => p[0]).join("");

export default function RecentInquiries({ rows }: { rows: RecentInquiry[] }) {
  return (
    <Panel
      title="Recent Inquiries"
      subtitle="Latest student inquiries from your platform"
      icon="Users"
      action={
        <Link
          href="/admin/inquiries"
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View All Inquiries <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {["Student Name", "Destination", "Program", "Assigned Counsellor", "Status", "Date", "Action"].map((h) => (
                <th key={h} className="pb-3 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r, idx) => (
              <tr key={r.id}>
                <td className="py-3 pr-3">
                  <span className="flex items-center gap-2.5 font-medium text-slate-800 dark:text-slate-100">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {initials(r.name)}
                    </span>
                    {r.name}
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{r.destination}</td>
                <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{r.program}</td>
                <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{r.counsellor}</td>
                <td className="py-3 pr-3"><StatusBadge status={r.status} /></td>
                <td className="whitespace-nowrap py-3 pr-3 text-slate-600 dark:text-slate-400">{r.date}</td>
                <td className="py-3">
                  <RowActions inquiry={r} up={idx >= 2} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
