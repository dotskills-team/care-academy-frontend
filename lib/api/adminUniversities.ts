// Admin calls for universities (browser, cookie auth). The public pages
// use lib/api/universities.ts instead.
import { api, apiRequest } from "./client";
import { toMultipart } from "./toMultipart";
import type { University } from "./universities";
import type { ApiMeta } from "./types";

export interface AdminUniversity extends Omit<University, "country"> {
  /** null only if the country record is gone */
  country: University["country"] | null;
  isPublished: boolean;
  createdAt?: string;
}

/** GET /university/admin/stats */
export interface UniversityStats {
  total: number;
  published: number;
  draft: number;
  partners: number;
  researchListings: number;
  /** Featured and published */
  featured: number;
  /** Fee, IELTS, levels, subjects or intakes still empty */
  missingDetails: number;
  missingImage: number;
}

export interface UniversityListMeta extends ApiMeta {
  page: number;
  limit: number;
  totalPage: number;
}

export interface UniversityListParams {
  page: number;
  limit: number;
  searchTerm?: string;
  /** Country id */
  country?: string;
  type?: string;
  /** "true" | "false" | undefined (all) */
  isPublished?: string;
}

export type UniversityPayload = Partial<
  Pick<
    AdminUniversity,
    | "name" | "city" | "type" | "intro" | "website" | "levels" | "subjects" | "ielts"
    | "tuitionFee" | "feeNote" | "intakes" | "order" | "isFeatured" | "isPublished"
  >
> & {
  /** Country id */
  country?: string;
  /** Removes the current image. A new one is passed as a File instead. */
  image?: "";
};

function toQuery(p: UniversityListParams) {
  const q = new URLSearchParams({ page: String(p.page), limit: String(p.limit), sort: "order name" });
  if (p.searchTerm?.trim()) q.set("searchTerm", p.searchTerm.trim());
  if (p.country) q.set("country", p.country);
  if (p.type) q.set("type", p.type);
  if (p.isPublished) q.set("isPublished", p.isPublished);
  return q.toString();
}

export const adminUniversitiesApi = {
  list: async (params: UniversityListParams, signal?: AbortSignal) => {
    const res = await apiRequest<AdminUniversity[]>(`/university/admin?${toQuery(params)}`, { signal });
    return { universities: res.data, meta: res.meta as UniversityListMeta };
  },
  stats: (signal?: AbortSignal) => api.get<UniversityStats>("/university/admin/stats", signal),
  create: (payload: UniversityPayload, imageFile?: File) =>
    api.post<unknown>("/university", toMultipart(payload, imageFile)),
  update: (id: string, payload: UniversityPayload, imageFile?: File) =>
    api.patch<unknown>(`/university/${id}`, toMultipart(payload, imageFile)),
  remove: (id: string) => api.delete<unknown>(`/university/${id}`),
};
