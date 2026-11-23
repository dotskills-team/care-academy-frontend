import { notFound } from "next/navigation";
import { findNavItem } from "@/lib/admin/nav";

// Placeholder for sidebar sections that are not built yet.
// Replace by adding a real folder (e.g. admin/(panel)/countries/page.js).
export function generateMetadata({ params }: { params: { section: string } }) {
  const item = findNavItem(params.section);
  return { title: item?.label ?? "Not found" };
}

export default function SectionPlaceholder({ params }: { params: { section: string } }) {
  const item = findNavItem(params.section);
  if (!item) notFound();

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.label}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This section is not built yet.</p>
    </div>
  );
}
