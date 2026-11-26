// Admin calls for countries (browser, cookie auth). The public pages
// use lib/api/countries.ts instead.
import { api, apiRequest } from "./client";
import { toMultipart } from "./toMultipart";
import type { Country } from "./countries";
import type { ApiMeta } from "./types";

export interface AdminCountry extends Country {
  isPublished: boolean;
  createdAt?: string;
}

/** GET /country/admin/stats */
export interface CountryStats {
  total: number;
  published: number;
  draft: number;
  /** Featured and published */
  featured: number;
  /** Tuition, visa, work rules or intakes still empty */
  missingDetails: number;
  missingImage: number;
}

export interface CountryListMeta extends ApiMeta {
  page: number;
  limit: number;
  totalPage: number;
}

export interface CountryListParams {
  page: number;
  limit: number;
  searchTerm?: string;
  /** "true" | "false" | undefined (all) */
  isPublished?: string;
}

export type CountryPayload = Partial<
  Pick<
    AdminCountry,
    | "name" | "code" | "intro" | "tuition" | "visa" | "workRules"
    | "intakes" | "highlights" | "order" | "isFeatured" | "isPublished"
  >
> & {
  /** Removes the current image. A new one is passed as a File instead. */
  image?: "";
};

function toQuery(p: CountryListParams) {
  const q = new URLSearchParams({ page: String(p.page), limit: String(p.limit), sort: "order name" });
  if (p.searchTerm?.trim()) q.set("searchTerm", p.searchTerm.trim());
  if (p.isPublished) q.set("isPublished", p.isPublished);
  return q.toString();
}

export const adminCountriesApi = {
  list: async (params: CountryListParams, signal?: AbortSignal) => {
    const res = await apiRequest<AdminCountry[]>(`/country/admin?${toQuery(params)}`, { signal });
    return { countries: res.data, meta: res.meta as CountryListMeta };
  },
  stats: (signal?: AbortSignal) => api.get<CountryStats>("/country/admin/stats", signal),
  create: (payload: CountryPayload, imageFile?: File) =>
    api.post<AdminCountry>("/country", toMultipart(payload, imageFile)),
  update: (id: string, payload: CountryPayload, imageFile?: File) =>
    api.patch<AdminCountry>(`/country/${id}`, toMultipart(payload, imageFile)),
  remove: (id: string) => api.delete<AdminCountry>(`/country/${id}`),
};
