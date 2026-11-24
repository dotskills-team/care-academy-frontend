"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { universities, destinations } from "@/lib/data";

const badgeStyle: Record<string, string> = {
  Partner: "bg-green-50 text-green-700",
  "Non-partner": "bg-slate-100 text-slate-600",
  "Research Listing": "bg-brand-50 text-brand-700",
};

function UniversitiesInner() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      const matchQ =
        !q ||
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.subjects.toLowerCase().includes(q.toLowerCase());
      const matchCountry = !country || u.country === country;
      const matchType = !type || u.type === type;
      return matchQ && matchCountry && matchType;
    });
  }, [q, country, type]);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">Universities</h1>
          <p className="mt-3 text-accent-300">Search and filter from our listed universities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or subject…"
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none md:col-span-2"
            />
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm">
              <option value="">All countries</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.country}>{d.country}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm">
              <option value="">All types</option>
              <option value="Partner">Partner</option>
              <option value="Non-partner">Non-partner</option>
              <option value="Research Listing">Research Listing</option>
            </select>
          </div>

          {universities.length > 0 && <p className="mb-4 text-sm text-slate-500">{filtered.length} universities found</p>}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((u) => (
              <div key={u.name} className="card overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image src={u.image} alt={u.name} fill sizes="33vw" className="object-cover" />
                  <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${badgeStyle[u.type]}`}>
                    {u.type}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900">{u.name}</h3>
                  <p className="text-sm text-slate-500">{u.city}, {u.country}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <span>📘 {u.subjects}</span>
                    <span>🎯 IELTS {u.ielts}</span>
                    <span>💵 {u.fee}</span>
                    <span>📅 {u.intake}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-slate-500">{universities.length === 0 ? "Partner universities will be listed here soon." : "No universities match your filters."}</p>
          )}
        </div>
      </section>
    </>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading…</div>}>
      <UniversitiesInner />
    </Suspense>
  );
}
