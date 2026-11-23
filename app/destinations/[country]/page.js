import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryForm from "@/components/InquiryForm";
import { destinations } from "@/lib/data";

export function generateStaticParams() {
  return destinations.map((d) => ({ country: d.slug }));
}

export function generateMetadata({ params }) {
  const d = destinations.find((x) => x.slug === params.country);
  return { title: d ? `Study in ${d.country}` : "Destination" };
}

export default function CountryPage({ params }) {
  const d = destinations.find((x) => x.slug === params.country);
  if (!d) return notFound();

  const facts = [
    { label: "Universities", value: `${d.universities}+` },
    { label: "Tuition", value: d.tuition },
    { label: "Visa", value: d.visa },
    { label: "Work Rules", value: d.workRules },
    { label: "Intakes", value: d.intakes.join(", ") },
  ];

  return (
    <>
      <section className="relative text-white">
        <div className="relative h-72 w-full">
          <Image src={d.image} alt={d.country} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        <div className="container absolute inset-0 flex flex-col justify-center">
          <p className="text-sm text-amber-200">Study Destination</p>
          <h1 className="text-4xl font-bold md:text-5xl">{d.flag} Study in {d.country}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
            <p className="mt-3 text-slate-600">{d.intro}</p>

            <h3 className="mt-10 text-xl font-bold text-slate-900">Key Facts</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              {facts.map((f, i) => (
                <div key={f.label} className={`grid grid-cols-3 gap-4 px-5 py-4 text-sm ${i % 2 ? "bg-white" : "bg-slate-50"}`}>
                  <span className="font-semibold text-slate-700">{f.label}</span>
                  <span className="col-span-2 text-slate-600">{f.value}</span>
                </div>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-bold text-slate-900">Why Study Here?</h3>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>✅ Globally recognised degrees and strong graduate outcomes.</li>
              <li>✅ Scholarships and tuition support for international students.</li>
              <li>✅ Post-study work opportunities and career pathways.</li>
              <li>✅ Safe, student-friendly cities and support services.</li>
            </ul>

            <div className="mt-8 flex gap-3">
              <Link href="/universities" className="btn-primary">See Universities</Link>
              <Link href="/contact" className="btn-outline">Talk to a Counsellor</Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="mb-3 text-lg font-bold text-slate-900">Free Consultation</h3>
            <InquiryForm compact />
          </aside>
        </div>
      </section>
    </>
  );
}
