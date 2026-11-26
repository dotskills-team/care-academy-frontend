// Public country data for server components. Unlike lib/api/client.ts this sends no
// cookies. Errors are thrown and shown by app/(public)/error.tsx.
import { liveFetch, resolveImage } from "./serverBase";
import type { ApiEnvelope } from "./types";

export interface Country {
  _id: string;
  name: string;
  slug: string;
  code: string;
  intro: string;
  image: string;
  tuition: string;
  visa: string;
  workRules: string;
  intakes: string[];
  highlights: string[];
  order: number;
  isFeatured: boolean;
  updatedAt: string;
}

// The API sends this tag to /api/revalidate after a change (only matters if caching returns)
export const COUNTRIES_TAG = "countries";

const withImageUrl = (country: Country): Country => ({ ...country, image: resolveImage(country.image) });

export async function getCountries(): Promise<Country[]> {
  const res = await liveFetch("/country");
  if (!res.ok) throw new Error(`Failed to load destinations (${res.status})`);
  const json = (await res.json()) as ApiEnvelope<Country[]>;
  return json.data.map(withImageUrl);
}

/** Resolves to null when there is no published country with this slug. */
export async function getCountry(slug: string): Promise<Country | null> {
  const res = await liveFetch(`/country/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load destination (${res.status})`);
  const json = (await res.json()) as ApiEnvelope<Country>;
  return withImageUrl(json.data);
}
