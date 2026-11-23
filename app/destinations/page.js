import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { destinations } from "@/lib/data";

export const metadata = { title: "Study Destinations" };

export default function DestinationsPage() {
  return (
    <>
      <PageHero title="Study Destinations" subtitle="Explore top countries for your international education." />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Countries" title="Choose Your Destination" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Link key={d.slug} href={`/destinations/${d.slug}`} className="card group overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={d.image} alt={d.country} fill sizes="33vw" className="object-cover transition group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">
                    {d.flag} {d.country}
                  </span>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm text-slate-600">{d.intro}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-brand-700">{d.universities}+ universities</span>
                    <span className="text-slate-400">View details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PageHero({ title, subtitle }) {
  return (
    <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-3 text-amber-200">{subtitle}</p>}
      </div>
    </section>
  );
}
