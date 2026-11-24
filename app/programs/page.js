import SectionHeading from "@/components/SectionHeading";
import { programs, subjectCategories } from "@/lib/data";

export const metadata = { title: "Study Programs" };

export default function ProgramsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">Study Programs</h1>
          <p className="mt-3 text-accent-300">Browse by study level or by subject category.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="By Level" title="Study Levels" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <div key={p.level} className="card p-6">
                <h3 className="text-lg font-semibold text-brand-700">{p.level}</h3>
                <p className="mt-2 text-sm text-slate-500">{p.note}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.subjects.map((s) => (
                    <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container">
          <SectionHeading eyebrow="By Subject" title="Subject Categories" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subjectCategories.map((c) => (
              <div key={c.name} className="card flex items-center gap-4 p-5">
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
