import Link from "next/link";
import { MapPin, Mail, Phone, GraduationCap } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "@/components/SocialIcons";
import { nav, site } from "@/lib/data";

const socials: [string, React.ComponentType<React.SVGProps<SVGSVGElement>>, string][] = [
  [site.socials.facebook, Facebook, "Facebook"],
  [site.socials.instagram, Instagram, "Instagram"],
  [site.socials.linkedin, Linkedin, "LinkedIn"],
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-accent-400">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-white">{site.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{site.tagline}</p>
          <div className="mt-6 flex gap-3">
            {socials.map(([h, I, l]) => (
              <a key={l} href={h} aria-label={l} className="grid h-10 w-10 place-items-center rounded-full bg-slate-800 transition hover:bg-accent-500 hover:text-slate-900">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-accent-400">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="transition hover:text-accent-400">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition hover:text-accent-400">Terms &amp; Conditions</Link></li>
            <li><Link href="/contact" className="transition hover:text-accent-400">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />{site.address}</li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /><a href={`tel:${site.phone}`} className="hover:text-white">{site.phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="text-center md:text-right">
            Disclaimer: Admission and visa outcomes depend on the respective universities and
            authorities; {site.name} does not guarantee any result.
          </p>
        </div>
      </div>
    </footer>
  );
}
