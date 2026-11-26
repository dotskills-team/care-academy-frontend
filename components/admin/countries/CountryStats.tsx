"use client";

import { CircleCheck, FileText, Globe, ImageOff, Star, TriangleAlert } from "lucide-react";
import StatTile, { type StatCardData } from "@/components/admin/ui/StatTile";
import { useCountryStats } from "@/lib/admin/countries";

export default function CountryStats() {
  const { data, isPending, isError } = useCountryStats();
  // Stats are a nice-to-have: if they fail (e.g. no permission) the list still works.
  if (isError) return null;

  const s = data;
  const cards: StatCardData[] = [
    { label: "Total Countries", hint: "All destinations", value: s?.total ?? 0, icon: Globe, tone: "indigo" },
    { label: "Published", hint: "Visible on the website", value: s?.published ?? 0, icon: CircleCheck, tone: "emerald" },
    { label: "Drafts", hint: "Hidden from visitors", value: s?.draft ?? 0, icon: FileText, tone: "sky" },
    { label: "Featured", hint: "Published on the home page", value: s?.featured ?? 0, icon: Star, tone: "violet" },
    { label: "Missing Details", hint: "Tuition, visa, work or intakes", value: s?.missingDetails ?? 0, icon: TriangleAlert, tone: "amber" },
    { label: "No Image", hint: "Needs a cover image", value: s?.missingImage ?? 0, icon: ImageOff, tone: "rose" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" aria-label="Country statistics">
      {cards.map((c) => (
        <StatTile key={c.label} card={c} total={s?.total ?? 0} loading={isPending} />
      ))}
    </section>
  );
}
