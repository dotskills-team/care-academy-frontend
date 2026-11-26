import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import type { University } from "@/lib/api/universities";
import { formatFee, universityBadge } from "@/lib/universityOptions";

export default function UniversityCard({ university: u }: { university: University }) {
  const facts = [
    { icon: "📘", value: u.subjects.slice(0, 3).join(", ") },
    { icon: "🎯", value: u.ielts === null ? "" : `IELTS ${u.ielts}` },
    { icon: "💵", value: formatFee(u.tuitionFee) },
    { icon: "📅", value: u.intakes.join(", ") },
  ].filter((f) => f.value);

  return (
    <Link href={`/universities/${u.slug}`} className="card group block h-full overflow-hidden">
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800">
        {u.image ? (
          <Image
            src={u.image}
            alt={u.name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span aria-hidden="true" className="grid h-full place-items-center text-5xl font-bold text-white/30">
            {u.name.charAt(0)}
          </span>
        )}
        <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${universityBadge[u.type]}`}>
          <BadgeCheck className="h-3.5 w-3.5" /> {u.type}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">{u.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0" /> {u.city}, {u.country.name}
        </p>
        {facts.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            {facts.map((f) => (
              <li key={f.icon} className="line-clamp-2">{f.icon} {f.value}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
