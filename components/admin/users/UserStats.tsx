"use client";

import { Headset, PenLine, ShieldCheck, UserCheck, Users } from "lucide-react";
import StatTile, { type StatCardData } from "@/components/admin/ui/StatTile";
import { useUserStats } from "@/lib/admin/users";

export default function UserStats() {
  const { data, isPending, isError } = useUserStats();
  // Stats are a nice-to-have: if they fail (e.g. no permission) the list still works.
  if (isError) return null;

  const s = data;
  const cards: StatCardData[] = [
    { label: "Total Users", hint: "All registered users", value: s?.total ?? 0, icon: Users, tone: "indigo" },
    { label: "Active Users", hint: "Can sign in right now", value: s?.active ?? 0, icon: UserCheck, tone: "emerald" },
    { label: "Admins", hint: "Manage users & content", value: s?.admin ?? 0, icon: ShieldCheck, tone: "violet" },
    { label: "Editors", hint: "Manage website content", value: s?.editor ?? 0, icon: PenLine, tone: "sky" },
    { label: "Counsellors", hint: "Handle inquiries", value: s?.counsellor ?? 0, icon: Headset, tone: "amber" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="User statistics">
      {cards.map((c) => (
        <StatTile key={c.label} card={c} total={s?.total ?? 0} loading={isPending} />
      ))}
    </section>
  );
}
