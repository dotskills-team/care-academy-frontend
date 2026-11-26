// Presentational pieces of the admin content forms.
export const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600";

const hintClass = "text-xs font-normal text-slate-500 dark:text-slate-400";
const errorClass = "text-xs font-medium text-rose-600 dark:text-rose-400";

export function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className={hintClass}>{description}</p>
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  required,
  hint,
  counter,
  invalid,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  /** Short text on the right, e.g. "12/80" */
  counter?: string;
  /** Highlights the counter when a limit is exceeded */
  invalid?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      <span className="flex items-baseline justify-between gap-2">
        <span>
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </span>
        {counter && <span className={`tabular-nums ${invalid ? errorClass : hintClass}`}>{counter}</span>}
      </span>
      {children}
      {error ? (
        <span className={`mt-1.5 block ${errorClass}`}>{error}</span>
      ) : (
        hint && <span className={`mt-1.5 block ${hintClass}`}>{hint}</span>
      )}
    </label>
  );
}

/** Multi-select shown as clickable chips. The result keeps the order of `options`. */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}) {
  const toggle = (option: string) =>
    onChange(options.filter((o) => (o === option ? !value.includes(o) : value.includes(o))));

  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 ${
                selected
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {hint && <p className={`mt-1.5 ${hintClass}`}>{hint}</p>}
    </fieldset>
  );
}

export function Toggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
        checked
          ? "border-indigo-300 bg-indigo-50/60 dark:border-indigo-500/40 dark:bg-indigo-500/10"
          : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${checked ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400"}`} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</span>
        <span className={`block ${hintClass}`}>{description}</span>
      </span>
      {/* The real checkbox stays in the page for keyboard and screen reader users */}
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/30 dark:bg-slate-700"
      />
    </label>
  );
}
