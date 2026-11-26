import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, ExternalLink, MapPin } from "lucide-react";
import Flag from "@/components/Flag";
import InquiryFormSection from "@/components/InquiryFormSection";
import { getUniversity } from "@/lib/api/universities";
import { formatFee, universityBadge } from "@/lib/universityOptions";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const u = await getUniversity(params.slug);
  if (!u) return { title: "University" };
  return {
    title: `${u.name}, ${u.country.name}`,
    description: u.intro.slice(0, 160) || `${u.name} in ${u.city}, ${u.country.name}`,
  };
}

export default async function UniversityPage({ params }: Props) {
  const u = await getUniversity(params.slug);
  if (!u) notFound();

  const facts = [
    { label: "Study Levels", value: u.levels.join(", ") },
    { label: "Tuition", value: [formatFee(u.tuitionFee), u.feeNote].filter(Boolean).join("\n") },
    { label: "IELTS", value: u.ielts === null ? "" : `Overall band ${u.ielts} or higher` },
    { label: "Intakes", value: u.intakes.join(", ") },
  ];

  return (
    <>
      <section className="relative text-white">
        <div className="relative h-72 w-full bg-brand-800">
          {u.image && <Image src={u.image} alt={u.name} fill sizes="100vw" className="object-cover" priority />}
          <div className="absolute inset-0 bg-brand-900/65" />
        </div>
        <div className="container absolute inset-0 flex flex-col justify-center">
          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${universityBadge[u.type]}`}>
            <BadgeCheck className="h-3.5 w-3.5" /> {u.type}
          </span>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">{u.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-accent-300">
            <MapPin className="h-4 w-4" /> {u.city}, {u.country.name}
            <Flag code={u.country.code} name={u.country.name} className="h-4 w-6" />
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {u.intro && (
              <>
                <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                <p className="mb-10 mt-3 whitespace-pre-line text-slate-600">{u.intro}</p>
              </>
            )}

            <h2 className="text-xl font-bold text-slate-900">Key Facts</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              {facts.map((f, i) => (
                <div key={f.label} className={`grid grid-cols-3 gap-4 px-5 py-4 text-sm ${i % 2 ? "bg-white" : "bg-slate-50"}`}>
                  <span className="font-semibold text-slate-700">{f.label}</span>
                  <span className="col-span-2 whitespace-pre-line text-slate-600">{f.value || "To be confirmed"}</span>
                </div>
              ))}
            </div>

            {u.subjects.length > 0 && (
              <>
                <h2 className="mt-10 text-xl font-bold text-slate-900">Subjects</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {u.subjects.map((subject, i) => (
                    <li key={i} className="rounded-full bg-brand-50 px-4 py-1.5 text-sm text-brand-700">{subject}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/destinations/${u.country.slug}`} className="btn-primary">Study in {u.country.name}</Link>
              <Link href="/contact" className="btn-outline">Talk to a Counsellor</Link>
              {u.website && (
                <a href={u.website} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Official Website <ExternalLink className="h-4 w-4" />
                </a>
              )}
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
