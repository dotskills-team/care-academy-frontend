"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarCheck, ShieldCheck, Users, Building2, Globe2 } from "lucide-react";
import { heroSlides } from "@/lib/home";

const trust = [
  { icon: Users, value: "5,000+", label: "Students guided" },
  { icon: Building2, value: "300+", label: "Partner universities" },
  { icon: Globe2, value: "15+", label: "Study destinations" },
  { icon: ShieldCheck, value: "98%", label: "Visa success rate" },
];

export default function HeroSlider({ children }) {
  const [i, setI] = useState(0);
  const n = heroSlides.length;

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n]);

  const words = heroSlides[i].title.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-900 text-white">
        {/* Photo panel (right on desktop, faded backdrop on mobile) */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[62%]">
          {heroSlides.map((s, k) => (
            <Image
              key={s.image}
              src={s.image}
              alt=""
              fill
              priority={k === 0}
              sizes="(max-width:1024px) 100vw, 62vw"
              className={`object-cover object-center transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-brand-900/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-brand-900 lg:via-brand-900/55 lg:to-brand-900/10" />
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-brand-900/70 to-transparent" />

        <div className="container relative pb-36 pt-16 lg:pb-44 lg:pt-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-400">
              <span className="h-px w-8 bg-accent-500" />
              Study Abroad Consultancy
            </p>

            <div key={i} className="animate-fade">
              <h1 className="mt-5 text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl xl:text-[3.5rem]">
                {head} <span className="text-accent-400">{tail}</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-100 md:text-lg">
                {heroSlides[i].text}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/#consultation-booking-form" className="btn-accent px-7 py-3.5 text-base">
                <CalendarCheck className="h-5 w-5" />
                Book Free Consultation
              </Link>
              <Link href="/destinations" className="btn border border-white/30 px-7 py-3.5 text-base text-white hover:bg-white/10">
                Explore Destinations
              </Link>
            </div>

            {children}
          </div>

          {/* Slider controls */}
          <div className="absolute bottom-24 right-4 flex items-center gap-3 sm:right-6 lg:bottom-28 lg:right-8">
            <button aria-label="Previous slide" onClick={() => setI((i - 1 + n) % n)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition hover:bg-white/25">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {heroSlides.map((_, k) => (
                <button key={k} aria-label={`Go to slide ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-accent-500" : "w-2 bg-white/50"}`} />
              ))}
            </div>
            <button aria-label="Next slide" onClick={() => setI((i + 1) % n)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition hover:bg-white/25">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust strip overlapping the banner */}
      <div className="container relative z-10 -mt-14 pb-4">
        <dl className="grid grid-cols-2 divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.25)] lg:grid-cols-4 lg:divide-x">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-4 p-5 lg:p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <t.icon className="h-6 w-6" />
              </span>
              <div>
                <dd className="text-2xl font-bold text-slate-900">{t.value}</dd>
                <dt className="text-sm text-slate-500">{t.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
