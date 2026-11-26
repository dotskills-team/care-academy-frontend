import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import InquiryFormSection from "@/components/InquiryFormSection";
import Flag from "@/components/Flag";
import UniversityCard from "@/components/universities/UniversityCard";
import { getCountry } from "@/lib/api/countries";
import { getUniversities } from "@/lib/api/universities";

type Props = { params: { country: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getCountry(params.country);
  return d ? { title: `Study in ${d.name}`, description: d.intro } : { title: "Destination" };
}

export default async function CountryPage({ params }: Props) {
  const d = await getCountry(params.country);
  if (!d) notFound();
  const { universities, total } = await getUniversities({ country: d.slug, limit: 4 });

  const pending = "To be confirmed";
  const facts = [
    { label: "Tuition", value: d.tuition },
    { label: "Visa", value: d.visa },
    { label: "Work Rules", value: d.workRules },
    { label: "Intakes", value: d.intakes.join(", ") },
  ];

  return (
    <>
      <section className="relative text-white">
        <div className="relative h-72 w-full bg-brand-800">
          {d.image && <Image src={d.image} alt={d.name} fill sizes="100vw" className="object-cover" priority />}
          <div className="absolute inset-0 bg-brand-900/65" />
        </div>
        <div className="container absolute inset-0 flex flex-col justify-center">
          <p className="text-sm text-accent-300">Study Destination</p>
          <h1 className="flex items-center gap-4 text-4xl font-bold md:text-5xl"><Flag code={d.code} name={d.name} className="h-8 w-12" /> Study in {d.name}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-slate-600">{d.intro}</p>

            <h3 className="mt-10 text-xl font-bold text-slate-900">Key Facts</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              {facts.map((f, i) => (
                <div key={f.label} className={`grid grid-cols-3 gap-4 px-5 py-4 text-sm ${i % 2 ? "bg-white" : "bg-slate-50"}`}>
                  <span className="font-semibold text-slate-700">{f.label}</span>
                  <span className="col-span-2 whitespace-pre-line text-slate-600">{f.value || pending}</span>
                </div>
              ))}
            </div>

            {d.highlights.length > 0 && (
              <>
                <h3 className="mt-10 text-xl font-bold text-slate-900">Why Study Here?</h3>
                <ul className="mt-4 space-y-2 text-slate-600">
                  {d.highlights.map((point, i) => (
                    <li key={i}>✅ {point}</li>
                  ))}
                </ul>
              </>
            )}

            {universities.length > 0 && (
              <>
                <h3 className="mt-10 text-xl font-bold text-slate-900">Universities in {d.name}</h3>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {universities.map((u) => (
                    <UniversityCard key={u._id} university={u} />
                  ))}
                </div>
                {total > universities.length && (
                  <p className="mt-3 text-sm text-slate-500">Showing {universities.length} of {total}.</p>
                )}
              </>
            )}

            <div className="mt-8 flex gap-3">
              <Link href={`/universities?country=${d.slug}`} className="btn-primary">See Universities</Link>
              <Link href="/contact" className="btn-outline">Talk to a Counsellor</Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="mb-3 text-lg font-bold text-slate-900">Free Consultation</h3>
            <InquiryFormSection compact />
          </aside>
        </div>
      </section>
    </>
  );
}
