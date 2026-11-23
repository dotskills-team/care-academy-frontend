import "./globals.css";
import { Inter } from "next/font/google";
import { site } from "@/lib/data";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Study Abroad Consultancy`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  keywords: ["study abroad", "education consultancy", "universities", "scholarships", "visa"],
};

// Root layout is intentionally bare. Public chrome lives in (public)/layout.js,
// the admin shell lives in admin/(panel)/layout.js.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-slate-800 antialiased">{children}</body>
    </html>
  );
}
