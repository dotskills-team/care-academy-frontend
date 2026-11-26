// Public university data for server components (no cookies, always live).
import type { Country } from "./countries";
import { liveFetch, resolveImage } from "./serverBase";
import type { UniversityFilterValues, UniversityType } from "@/lib/universityOptions";
import type { ApiEnvelope } from "./types";

export interface University {
  _id: string;
  name: string;
  slug: string;
  country: Pick<Country, "_id" | "name" | "slug" | "code">;
  city: string;
  type: UniversityType;
  intro: string;
  website: string;
  image: string;
  levels: string[];
  subjects: string[];
  ielts: number | null;
  tuitionFee: number | null;
  feeNote: string;
  intakes: string[];
  order: number;
  isFeatured: boolean;
  updatedAt: string;
}

// The API sends this tag to /api/revalidate after a change (only matters if caching returns)
export const UNIVERSITIES_TAG = "universities";

export type UniversityQuery = UniversityFilterValues & { page?: number; limit?: number; featured?: boolean };

export interface UniversityPage {
  universities: University[];
  page: number;
  total: number;
  totalPage: number;
}

const withImageUrl = (u: University): University => ({ ...u, image: resolveImage(u.image) });

export async function getUniversities(query: UniversityQuery = {}): Promise<UniversityPage> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });

  const res = await liveFetch(`/university?${params}`);
  if (!res.ok) throw new Error(`Failed to load universities (${res.status})`);
  const json = (await res.json()) as ApiEnvelope<University[]>;
  const meta = json.meta as unknown as { page: number; total: number; totalPage: number };
  return { universities: json.data.map(withImageUrl), page: meta.page, total: meta.total, totalPage: meta.totalPage };
}

export async function getSubjectOptions(): Promise<string[]> {
  const res = await liveFetch("/university/filters");
  if (!res.ok) throw new Error(`Failed to load filters (${res.status})`);
  return ((await res.json()) as ApiEnvelope<{ subjects: string[] }>).data.subjects;
}

/** Resolves to null when there is no visible university with this slug. */
export async function getUniversity(slug: string): Promise<University | null> {
  const res = await liveFetch(`/university/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load university (${res.status})`);
  return withImageUrl(((await res.json()) as ApiEnvelope<University>).data);
}
