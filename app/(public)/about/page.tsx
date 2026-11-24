import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { stats } from "@/lib/data";

export const metadata = { title: "About Us" };

// PLACEHOLDER portraits (stock photos). Replace names, roles and photos with the real
// team once the client sends them (save as public/images/team/member-N.jpg).
const team = [
  { name: "Team Member", role: "Founder & CEO", photo: "/images/team/member-1.jpg" },
  { name: "Team Member", role: "Head of Counselling", photo: "/images/team/member-4.jpg" },
  { name: "Team Member", role: "Visa Specialist", photo: "/images/team/member-3.jpg" },
  { name: "Team Member", role: "Admissions Officer", photo: "/images/team/member-2.jpg" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">About CARE Consultancy</h1>
          <p className="mt-3 text-accent-300">Guiding students toward their global education dreams.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who We Are" title="Your Trusted Education Partner" />
            <p className="text-slate-600">
              CARE – Consultancy for Academic Research & Education is a student-first
              consultancy based in Dhaka, helping aspiring students study at leading
              universities in Europe. [Company profile text pending from client.]
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
              <div key={i} className="card card-accent group overflow-hidden">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-50">
                  <Image src={m.photo} alt={`${m.role}`} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover object-top transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-900/80 to-transparent" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-slate-900">{m.name}</h3>
                  <p className="mt-1 text-sm font-medium text-brand-600">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
