const styles: Record<string, string> = {
  New: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  Contacted: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  Closed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}
