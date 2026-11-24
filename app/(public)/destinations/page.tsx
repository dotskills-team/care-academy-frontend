import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Flag from "@/components/Flag";
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
                  <Image src={d.image} alt={`Study in ${d.country}`} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold"><Flag code={d.code} name={d.country} className="h-4 w-6" /> {d.country}</span>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm text-slate-600">{d.intro}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-brand-700">View details →</span>
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

function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
      <div className="container py-16 text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-3 text-accent-300">{subtitle}</p>}
      </div>
    </section>
  );
}
