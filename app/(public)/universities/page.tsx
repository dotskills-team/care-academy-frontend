import Link from "next/link";
import UniversityCard from "@/components/universities/UniversityCard";
import UniversityFilters from "@/components/universities/UniversityFilters";
import { getCountries } from "@/lib/api/countries";
import { getSubjectOptions, getUniversities } from "@/lib/api/universities";
import { FILTER_KEYS, type UniversityFilterValues } from "@/lib/universityOptions";

export const metadata = { title: "Universities" };

type SearchParams = Record<string, string | string[] | undefined>;

const single = (value: string | string[] | undefined) => (typeof value === "string" ? value.trim() : "");

// The filters come from the URL, so a search or filter link arrives fully rendered.
export default async function UniversitiesPage({ searchParams }: { searchParams: SearchParams }) {
  const filters: UniversityFilterValues = {};
  FILTER_KEYS.forEach((key) => {
    const value = single(searchParams[key]);
    if (value) filters[key] = value;
  });
  const page = Math.max(1, Math.floor(Number(single(searchParams.page))) || 1);

  const [result, countries, subjects] = await Promise.all([
    getUniversities({ ...filters, page }),
    getCountries(),
    getSubjectOptions(),
  ]);

  const filtered = Object.keys(filters).length > 0;
  const pageHref = (target: number) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/universities?${query}` : "/universities";
  };

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">Universities</h1>
          <p className="mt-3 text-accent-300">Search and filter from our listed universities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* The key refills the form when the URL changes */}
          <UniversityFilters
            key={JSON.stringify(filters)}
            values={filters}
            countries={countries.map((c) => ({ value: c.slug, label: c.name }))}
            subjects={subjects}
          />

          {result.universities.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-slate-500">
                {result.total} {result.total === 1 ? "university" : "universities"} found
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {result.universities.map((u) => (
                  <UniversityCard key={u._id} university={u} />
                ))}
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-slate-500">
              {filtered || page > 1 ? "No universities match your filters." : "Partner universities will be listed here soon."}
            </p>
          )}

          {result.totalPage > 1 && (
            <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-4 text-sm">
              {page > 1 && <Link href={pageHref(page - 1)} className="btn-outline">Previous</Link>}
              <span className="text-slate-500">Page {page} of {result.totalPage}</span>
              {page < result.totalPage && <Link href={pageHref(page + 1)} className="btn-outline">Next</Link>}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
