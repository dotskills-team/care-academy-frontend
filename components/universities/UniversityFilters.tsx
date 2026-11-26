"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Search } from "lucide-react";
import { FILTER_KEYS, type UniversityFilterValues } from "@/lib/universityOptions";
import { INTAKE_MONTHS, STUDY_LEVELS, UNIVERSITY_TYPES } from "@/lib/universityOptions";

const control =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none";

type Option = { value: string; label: string };
const toOptions = (values: readonly string[]): Option[] => values.map((v) => ({ value: v, label: v }));

type Props = {
  values: UniversityFilterValues;
  countries: Option[];
  subjects: string[];
};

// The filters live in the URL, so results are rendered on the server and can be shared.
// It is a plain GET form, which also works before JavaScript has loaded.
export default function UniversityFilters({ values, countries, subjects }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function apply(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams();
    FILTER_KEYS.forEach((key) => {
      const value = String(data.get(key) ?? "").trim();
      if (value) params.set(key, value);
    });
    const query = params.toString();
    // A new search starts again from the first page
    startTransition(() => router.push(query ? `/universities?${query}` : "/universities", { scroll: false }));
  }

  const select = (name: keyof UniversityFilterValues, all: string, options: Option[]) => (
    <select
      name={name}
      defaultValue={values[name] ?? ""}
      aria-label={all}
      onChange={(e) => apply(e.currentTarget.form!)}
      className={control}
    >
      <option value="">{all}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );

  return (
    <form
      action="/universities"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        apply(e.currentTarget);
      }}
      className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    >
      <input
        name="q"
        defaultValue={values.q ?? ""}
        maxLength={100}
        placeholder="Search by name, city or subject…"
        aria-label="Search"
        className={`${control} sm:col-span-2`}
      />
      {select("country", "All countries", countries)}
      {select("type", "All types", toOptions(UNIVERSITY_TYPES))}
      {select("level", "All levels", toOptions(STUDY_LEVELS))}
      {select("subject", "All subjects", toOptions(subjects))}
      {select("intake", "All intakes", toOptions(INTAKE_MONTHS))}
      <input
        name="ielts"
        type="number"
        min={0}
        max={9}
        step={0.5}
        defaultValue={values.ielts ?? ""}
        placeholder="My IELTS score"
        aria-label="My IELTS score"
        className={control}
      />
      <input
        name="maxFee"
        type="number"
        min={0}
        step={1}
        defaultValue={values.maxFee ?? ""}
        placeholder="Max yearly fee (€)"
        aria-label="Maximum yearly fee in euro"
        className={control}
      />
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3 lg:justify-end">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Search
        </button>
        {FILTER_KEYS.some((key) => values[key]) && (
          <Link href="/universities" scroll={false} className="text-sm font-medium text-slate-500 hover:text-brand-700">
            Clear filters
          </Link>
        )}
      </div>
    </form>
  );
}
