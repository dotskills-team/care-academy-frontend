import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">Our Services</h1>
          <p className="mt-3 text-accent-300">Complete support from first consultation to departure.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="How We Help" title="What CARE Consultancy Offers" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="card p-6">
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${s.by === "CARE" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"}`}>
                  {s.by === "CARE" ? "CARE-delivered" : "Partner-delivered"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-brand-700 p-10 text-center text-white">
            <h2 className="text-2xl font-bold">Not sure where to start?</h2>
            <p className="mt-2 text-accent-300">Book a free consultation and let our counsellors guide you.</p>
            <Link href="/contact" className="btn-accent mt-6">Book Free Consultation</Link>
          </div>
        </div>
      </section>
    </>
  );
}
