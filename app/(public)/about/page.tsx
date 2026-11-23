import SectionHeading from "@/components/SectionHeading";
import { stats } from "@/lib/data";

export const metadata = { title: "About Us" };

const team = [
  { name: "Team Member", role: "Founder & CEO" },
  { name: "Team Member", role: "Head of Counselling" },
  { name: "Team Member", role: "Visa Specialist" },
  { name: "Team Member", role: "Admissions Officer" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">About CARE Academy</h1>
          <p className="mt-3 text-amber-200">Guiding students toward their global education dreams.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who We Are" title="Your Trusted Education Partner" />
            <p className="text-slate-600">
              CARE Academy is a student-first education consultancy helping aspiring
              students study at leading universities around the world. [Replace this
              with the real company story before launch.]
            </p>
            <p className="mt-4 text-slate-600">
              Our experienced counsellors provide honest, personalised guidance — from
              choosing the right university and scholarship to visa approval and
              pre-departure support.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="card p-6 text-center">
                <p className="text-3xl font-bold text-brand-700">{s.value}</p>
                <p className="mt-1 text-sm text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container">
          <SectionHeading center eyebrow="Our People" title="Meet the Team" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                  {m.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{m.name}</h3>
                <p className="text-sm text-slate-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
