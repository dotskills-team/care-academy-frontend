import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quote, MapPin, GraduationCap, Building2, Wallet, BadgeCheck } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import HeroSearch from "@/components/HeroSearch";
import SectionHeading from "@/components/SectionHeading";
import Faq from "@/components/Faq";
import Icon from "@/components/Icon";
import ApplySteps from "@/components/ApplySteps";
import Flag from "@/components/Flag";
import InquiryForm from "@/components/InquiryForm";
import { formImage, intro, homeServices, servicesImage, introImage } from "@/lib/home";
import { destinations, universities, scholarships, testimonials } from "@/lib/data";

const badgeStyle: Record<string, string> = {
  Partner: "bg-green-100 text-green-800",
  "Non-partner": "bg-slate-100 text-slate-700",
  "Research Listing": "bg-accent-100 text-accent-700",
};

export default function HomePage() {
  return (
    <>
      {/* Hero + search */}
      <HeroSlider>
        <HeroSearch />
      </HeroSlider>


      {/* Intro + stats */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image src={introImage} alt="Student counselling session" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">About CARE</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-[2.5rem] md:leading-tight">{intro.title}</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{intro.text}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              {intro.stats.map((st) => (
                <div key={st.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon name={st.icon} className="h-6 w-6" /></span>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{st.value}{st.suffix}</p>
                    <p className="text-sm text-slate-500">{st.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-primary mt-8">About CARE <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Study Destinations" title="Featured Destinations" subtitle="Choose from leading study destinations and let our advisors match you with the right university." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Link key={d.slug} href={`/destinations/${d.slug}`} className="card group overflow-hidden">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image src={d.image} alt={`Study in ${d.country}`} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 to-transparent" />
                  <span className="absolute right-4 top-3"><Flag code={d.code} name={d.country} className="h-6 w-9" /></span>
                  <h3 className="absolute bottom-4 left-5 flex items-center gap-2 text-xl font-semibold text-white">
                    <MapPin className="h-5 w-5 text-accent-400" /> {d.country}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{d.intro}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-700">Study in {d.country}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-4 py-1.5 text-sm font-semibold text-slate-900 transition group-hover:bg-accent-400">
                      Discover <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Services */}
      <section className="section bg-slate-50">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="CARE" title="Our Services" />
            <div className="grid gap-5 sm:grid-cols-2">
              {homeServices.map((sv) => (
                <div key={sv.title} className="card card-accent p-5 pt-6">
                  <span className="icon-badge"><Icon name={sv.icon} className="h-6 w-6" /></span>
                  <h3 className="mt-4 font-semibold text-slate-900">{sv.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{sv.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/services" className="btn-outline mt-8">View Services <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-3xl shadow-xl lg:block">
            <Image src={servicesImage} alt="Advisors discussing a student application" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <ApplySteps />

      {/* Featured universities */}
      {universities.length > 0 && <section className="section bg-slate-50">
        <div className="container">
          <SectionHeading center eyebrow="Universities" title="Featured Universities" subtitle="A glimpse of our partner and listed universities." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.slice(0, 3).map((u) => (
              <div key={u.name} className="card card-accent group overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={u.image} alt={u.name} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle[u.type]}`}>
                    <BadgeCheck className="h-3.5 w-3.5" /> {u.type}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{u.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" /> {u.city}, {u.country}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">{u.subjects}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/universities" className="btn-outline px-6 py-3">
              View All Universities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>}

      {/* Scholarships */}
      {scholarships.length > 0 && <section className="section bg-brand-800 text-white">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">Funding</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-[2.5rem] md:leading-tight">Scholarships Available</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {scholarships.map((s) => (
              <div key={s.name} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-accent-400/60 hover:bg-white/15">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-500 text-slate-900">
                  <Wallet className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm text-brand-100">{s.country}</p>
                <h3 className="mt-1 font-semibold">{s.name}</h3>
                <p className="mt-4 text-xl font-bold text-accent-400">{s.amount}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-100">
                  <GraduationCap className="h-3.5 w-3.5" /> {s.level}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* Success stories */}
      {testimonials.length > 0 && <section className="section">
        <div className="container">
          <SectionHeading center eyebrow="Success Stories" title="What Our Students Say" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure key={i} className="card card-accent flex flex-col p-6 pt-7">
                <Quote className="h-9 w-9 text-accent-500" />
                <blockquote className="mt-3 flex-1 leading-relaxed text-slate-600">{t.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-accent-500">
                    <Image src={t.image} alt={t.name} fill sizes="44px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{t.name}</span>
                    <span className="block text-xs text-slate-500">{t.course}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>}

      {/* FAQ */}
      <section className="section bg-slate-50">
        <div className="container">
          <SectionHeading center eyebrow="FAQ" title="Frequently Asked Questions" />
          <Faq />
        </div>
      </section>

      {/* Inquiry form */}
      <section id="consultation-booking-form" className="section scroll-mt-20 bg-brand-800 text-white">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">Get in touch</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-[2.5rem] md:leading-tight">Book a free consultation with our experts</h2>
            <p className="mt-4 text-brand-100">Tell us about your goals and a counsellor will contact you with the right next steps.</p>
            <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl lg:block">
              <Image src={formImage} alt="A student holding a book" fill sizes="50vw" className="object-cover" />
            </div>
          </div>
          <div className="text-slate-800">
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
