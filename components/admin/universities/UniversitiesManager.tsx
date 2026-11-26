"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft, ChevronRight, Ellipsis, ExternalLink, Eye, EyeOff, LoaderCircle,
  Pencil, Plus, Search, Star, Trash2, TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import Dropdown, { menuItemClass } from "@/components/admin/layout/Dropdown";
import Modal from "@/components/admin/ui/Modal";
import UniversityFormModal from "./UniversityFormModal";
import UniversityStats from "./UniversityStats";
import { useAdminCountries } from "@/lib/admin/countries";
import { useAdminUniversities, useDeleteUniversity, useUpdateUniversity } from "@/lib/admin/universities";
import { useCurrentUser } from "@/lib/auth/hooks";
import { assetUrl } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import type { AdminUniversity } from "@/lib/api/adminUniversities";
import { UNIVERSITY_TYPES, universityBadge, type UniversityType } from "@/lib/universityOptions";

const LIMIT = 10;
const controlClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200";
const cardClass = "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";
const pagerClass =
  "rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800";

// The public badge colours have no dark variants, so the admin has its own
const typeClass: Record<UniversityType, string> = {
  Partner: "dark:bg-emerald-500/20 dark:text-emerald-300",
  "Non-partner": "dark:bg-slate-800 dark:text-slate-300",
  "Research Listing": "dark:bg-amber-500/20 dark:text-amber-300",
};

function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        published
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default function UniversitiesManager() {
  const { data: me } = useCurrentUser();
  const isSuperAdmin = !!me && me.role.isSystem && me.role.name === "SUPER_ADMIN";
  // Only hides controls; the server enforces the same permissions
  const can = (p: string) => isSuperAdmin || !!me?.role.permissions.includes(p);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<AdminUniversity | "new" | null>(null);
  const [deleting, setDeleting] = useState<AdminUniversity | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const universities = useAdminUniversities({
    page,
    limit: LIMIT,
    searchTerm: debounced,
    country: country || undefined,
    type: type || undefined,
    isPublished: status || undefined,
  });
  const countries = useAdminCountries({ page: 1, limit: 200 });
  const update = useUpdateUniversity();
  const remove = useDeleteUniversity();

  const rows = universities.data?.universities ?? [];
  const meta = universities.data?.meta;
  const error = universities.error;
  const forbidden = error instanceof ApiError && error.status === 403;

  // Don't strand the user on a page that a delete or a filter change has emptied
  useEffect(() => {
    if (meta && !universities.isPlaceholderData && page > 1 && page > meta.totalPage) {
      setPage(Math.max(1, meta.totalPage));
    }
  }, [meta, page, universities.isPlaceholderData]);

  const filterBy = (apply: (value: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    apply(e.target.value);
    setPage(1);
  };

  // Published here is only visible if the country is published too
  const isLive = (u: AdminUniversity) =>
    u.isPublished && !!countries.data?.countries.find((c) => c._id === u.country?._id)?.isPublished;

  async function toggle(u: AdminUniversity, key: "isPublished" | "isFeatured") {
    const next = !u[key];
    try {
      await update.mutateAsync({ id: u._id, payload: { [key]: next } });
      const done =
        key === "isPublished" ? (next ? "published" : "unpublished") : next ? "featured" : "removed from featured";
      toast.success(`${u.name} ${done}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the university.");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting._id);
      toast.success(`${deleting.name} deleted`);
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the university.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Universities</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage the universities listed on the website.
          </p>
        </div>
        {can("university:create") && (
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add university
          </button>
        )}
      </div>

      <UniversityStats />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            // Brackets and the like would be read as a regular expression by the API search
            onChange={(e) => setSearch(e.target.value.replace(/[.*+?^${}()|[\]\\]/g, ""))}
            placeholder="Search by name or city…"
            aria-label="Search universities"
            className={`${controlClass} w-full pl-10`}
          />
        </div>
        <select value={country} onChange={filterBy(setCountry)} aria-label="Filter by country" className={controlClass}>
          <option value="">All countries</option>
          {countries.data?.countries.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select value={type} onChange={filterBy(setType)} aria-label="Filter by type" className={controlClass}>
          <option value="">All types</option>
          {UNIVERSITY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={status} onChange={filterBy(setStatus)} aria-label="Filter by status" className={controlClass}>
          <option value="">All statuses</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {error && !universities.data ? (
        <div className={`flex flex-col items-center gap-2 py-12 text-center ${cardClass}`}>
          <TriangleAlert className="h-8 w-8 text-amber-500" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {forbidden ? "You don't have permission to view universities." : error.message}
          </p>
          {!forbidden && (
            <button
              onClick={() => universities.refetch()}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          )}
        </div>
      ) : universities.isPending ? (
        <div className={`grid place-items-center py-20 ${cardClass}`} role="status" aria-label="Loading universities">
          <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : rows.length === 0 ? (
        <p className={`py-14 text-center text-sm text-slate-500 dark:text-slate-400 ${cardClass}`}>No universities found.</p>
      ) : (
        <div className={universities.isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className={`overflow-x-auto shadow-sm ${cardClass}`}>
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3.5">University</th>
                  <th className="px-3 py-3.5">Country</th>
                  <th className="px-3 py-3.5">Type</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Featured</th>
                  <th className="px-3 py-3.5">Updated</th>
                  <th className="px-5 py-3.5 text-right"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((u, idx) => (
                  <tr key={u._id} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-3">
                        <span className="grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-sm font-bold text-slate-400 dark:bg-slate-800">
                          {u.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={assetUrl(u.image)} alt="" loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            u.name.charAt(0)
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-slate-900 dark:text-slate-100">{u.name}</span>
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{u.city}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 dark:text-slate-400">{u.country?.name ?? "—"}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${universityBadge[u.type]} ${typeClass[u.type]}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="px-3 py-3.5"><PublishBadge published={u.isPublished} /></td>
                    <td className="px-3 py-3.5">
                      <Star
                        aria-label={u.isFeatured ? "Featured" : "Not featured"}
                        className={`h-4 w-4 ${u.isFeatured ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-600 dark:text-slate-400">
                      {new Date(u.updatedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        {(isLive(u) || can("university:update") || can("university:delete")) && (
                          <Dropdown
                            label={`Actions for ${u.name}`}
                            width="w-52"
                            up={idx >= rows.length - 2 && rows.length > 3}
                            buttonClassName="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            button={<Ellipsis className="h-5 w-5" />}
                          >
                            {can("university:update") && (
                              <>
                                <button type="button" onClick={() => setEditing(u)} className={menuItemClass}>
                                  <Pencil className="h-4 w-4" /> Edit
                                </button>
                                <button type="button" onClick={() => toggle(u, "isPublished")} className={menuItemClass}>
                                  {u.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  {u.isPublished ? "Unpublish" : "Publish"}
                                </button>
                                <button type="button" onClick={() => toggle(u, "isFeatured")} className={menuItemClass}>
                                  <Star className="h-4 w-4" /> {u.isFeatured ? "Remove from featured" : "Mark as featured"}
                                </button>
                              </>
                            )}
                            {isLive(u) && (
                              <a href={`/universities/${u.slug}`} target="_blank" rel="noreferrer" className={menuItemClass}>
                                <ExternalLink className="h-4 w-4" /> View on website
                              </a>
                            )}
                            {can("university:delete") && (
                              <button type="button" onClick={() => setDeleting(u)} className={`${menuItemClass} !text-rose-600 dark:!text-rose-400`}>
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            )}
                          </Dropdown>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPage > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Page {meta.page} of {meta.totalPage} ({meta.total} universities)</span>
              <span className="flex gap-2">
                <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1} aria-label="Previous page" className={pagerClass}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPage} aria-label="Next page" className={pagerClass}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </span>
            </div>
          )}
        </div>
      )}

      {editing && (
        <UniversityFormModal
          university={editing === "new" ? undefined : editing}
          nextOrder={(meta?.total ?? 0) + 1}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <Modal title="Delete university" onClose={() => !remove.isPending && setDeleting(null)}>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Delete <strong>{deleting.name}</strong>? Its page will be removed from the website.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setDeleting(null)}
              disabled={remove.isPending}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={remove.isPending}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-70"
            >
              {remove.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
