"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = (e) => {
    e.preventDefault();
    router.push(`/universities?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={go}
      className="mt-6 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-xl"
    >
      <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search universities, courses or destinations…"
        className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 focus:outline-none"
      />
      <button type="submit" className="btn-primary rounded-full px-6">Search</button>
    </form>
  );
}
