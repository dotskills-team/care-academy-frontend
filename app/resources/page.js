import SectionHeading from "@/components/SectionHeading";
import { resources, intakes } from "@/lib/data";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">Resources</h1>
          <p className="mt-3 text-amber-200">Guides, blogs, downloads and the intake calendar.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Learn" title="Guides, Blogs & Downloads" />
          <div className="grid gap-6 sm:grid-cols-2">
            {resources.map((r) => (
              <div key={r.title} className="card p-6">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{r.type}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{r.desc}</p>
                <button className="mt-4 text-sm font-semibold text-brand-700 hover:underline">
                  {r.type === "Download" ? "Download →" : "Read more →"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container">
          <SectionHeading eyebrow="Plan Ahead" title="Intake Calendar" />
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-5 py-3">Intake</th>
                  <th className="px-5 py-3">Countries</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {intakes.map((i) => (
                  <tr key={i.month}>
                    <td className="px-5 py-4 font-medium text-slate-900">{i.month}</td>
                    <td className="px-5 py-4 text-slate-600">{i.countries}</td>
                    <td className="px-5 py-4 text-slate-600">{i.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
