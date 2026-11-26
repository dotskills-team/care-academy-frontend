"use client";

import { BookOpen, CircleCheck, FileText, Handshake, ImageOff, Landmark, Star, TriangleAlert } from "lucide-react";
import StatTile, { type StatCardData } from "@/components/admin/ui/StatTile";
import { useUniversityStats } from "@/lib/admin/universities";

export default function UniversityStats() {
  const { data, isPending, isError } = useUniversityStats();
  // Stats are a nice-to-have: if they fail (e.g. no permission) the list still works.
  if (isError) return null;

  const s = data;
  const cards: StatCardData[] = [
    { label: "Total Universities", hint: "All listings", value: s?.total ?? 0, icon: Landmark, tone: "indigo" },
    { label: "Published", hint: "Marked for the website", value: s?.published ?? 0, icon: CircleCheck, tone: "emerald" },
    { label: "Drafts", hint: "Hidden from visitors", value: s?.draft ?? 0, icon: FileText, tone: "sky" },
    { label: "Featured", hint: "Published and featured", value: s?.featured ?? 0, icon: Star, tone: "violet" },
    { label: "Partners", hint: "Partner badge", value: s?.partners ?? 0, icon: Handshake, tone: "emerald" },
    { label: "Research Listings", hint: "Research Listing badge", value: s?.researchListings ?? 0, icon: BookOpen, tone: "sky" },
    { label: "Missing Details", hint: "Fee, IELTS, levels, subjects or intakes", value: s?.missingDetails ?? 0, icon: TriangleAlert, tone: "amber" },
    { label: "No Image", hint: "Needs a cover image", value: s?.missingImage ?? 0, icon: ImageOff, tone: "rose" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="University statistics">
      {cards.map((c) => (
        <StatTile key={c.label} card={c} total={s?.total ?? 0} loading={isPending} />
      ))}
    </section>
  );
}
