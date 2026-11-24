import Link from "next/link";
import Icon from "@/components/Icon";
import type { TimedItem } from "@/lib/admin/types";

function ListCard({
  title,
  icon,
  items,
  href,
  dot = "bg-emerald-500",
}: {
  title: string;
  icon: string;
  items: TimedItem[];
  href: string;
  dot?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Icon name={icon} className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> {title}
        </h2>
        <Link href={href} className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
          View All →
        </Link>
      </header>
      <ul className="space-y-2.5 text-xs">
        {items.map((i) => (
          <li key={i.text} className="flex items-start gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${i.color ?? dot}`} />
            <span className="flex-1 text-slate-800 dark:text-slate-200">{i.text}</span>
            <span className="shrink-0 text-right text-slate-500 dark:text-slate-400">{i.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SideLists({
  contentUpdates,
  deadlines,
  activity,
}: {
  contentUpdates: TimedItem[];
  deadlines: TimedItem[];
  activity: TimedItem[];
}) {
  return (
    <div className="space-y-4">
      {/* TODO: point hrefs at the real list pages (content log, intake calendar, activity log) when built */}
      <ListCard title="Recent Content Updates" icon="FileText" items={contentUpdates} href="/admin/articles" />
      <ListCard title="Upcoming Intake Deadlines" icon="Layers" items={deadlines} href="/admin/countries" />
      <ListCard title="Recent System Activity" icon="Activity" items={activity} href="/admin/users" dot="bg-indigo-500" />
    </div>
  );
}
