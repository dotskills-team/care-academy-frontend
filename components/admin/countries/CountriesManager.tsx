"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft, ChevronRight, Ellipsis, ExternalLink, Eye, EyeOff, LoaderCircle,
  Pencil, Plus, Search, Star, Trash2, TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import Flag from "@/components/Flag";
import Dropdown, { menuItemClass } from "@/components/admin/layout/Dropdown";
import Modal from "@/components/admin/ui/Modal";
import CountryFormModal from "./CountryFormModal";
import CountryStats from "./CountryStats";
import { useAdminCountries, useDeleteCountry, useUpdateCountry } from "@/lib/admin/countries";
import { useCurrentUser } from "@/lib/auth/hooks";
import { assetUrl } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import type { AdminCountry } from "@/lib/api/adminCountries";

const LIMIT = 10;
const controlClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200";
const cardClass = "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";
const pagerClass =
  "rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800";

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

export default function CountriesManager() {
  const { data: me } = useCurrentUser();
  const isSuperAdmin = !!me && me.role.isSystem && me.role.name === "SUPER_ADMIN";
  // Only hides controls; the server enforces the same permissions
  const can = (p: string) => isSuperAdmin || !!me?.role.permissions.includes(p);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<AdminCountry | "new" | null>(null);
  const [deleting, setDeleting] = useState<AdminCountry | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const countries = useAdminCountries({
    page,
    limit: LIMIT,
    searchTerm: debounced,
    isPublished: status || undefined,
  });
  const update = useUpdateCountry();
  const remove = useDeleteCountry();

  const rows = countries.data?.countries ?? [];
  const meta = countries.data?.meta;
  const error = countries.error;
  const forbidden = error instanceof ApiError && error.status === 403;

  // Don't strand the user on a page that a delete or a filter change has emptied
  useEffect(() => {
    if (meta && !countries.isPlaceholderData && page > 1 && page > meta.totalPage) {
      setPage(Math.max(1, meta.totalPage));
    }
  }, [meta, page, countries.isPlaceholderData]);

  async function toggle(c: AdminCountry, key: "isPublished" | "isFeatured") {
    const next = !c[key];
    try {
      await update.mutateAsync({ id: c._id, payload: { [key]: next } });
      const done =
        key === "isPublished" ? (next ? "published" : "unpublished") : next ? "featured" : "removed from featured";
      toast.success(`${c.name} ${done}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the country.");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting._id);
      toast.success(`${deleting.name} deleted`);
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the country.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Countries</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage the study destinations shown on the website.
          </p>
        </div>
        {can("country:create") && (
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add country
          </button>
        )}
      </div>

      <CountryStats />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            // Brackets and the like would be read as a regular expression by the API search
            onChange={(e) => setSearch(e.target.value.replace(/[.*+?^${}()|[\]\\]/g, ""))}
            placeholder="Search by name, slug or introduction…"
            aria-label="Search countries"
            className={`${controlClass} w-full pl-10`}
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
          className={controlClass}
        >
          <option value="">All statuses</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {error && !countries.data ? (
        <div className={`flex flex-col items-center gap-2 py-12 text-center ${cardClass}`}>
          <TriangleAlert className="h-8 w-8 text-amber-500" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {forbidden ? "You don't have permission to view countries." : error.message}
          </p>
          {!forbidden && (
            <button
              onClick={() => countries.refetch()}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          )}
        </div>
      ) : countries.isPending ? (
        <div className={`grid place-items-center py-20 ${cardClass}`} role="status" aria-label="Loading countries">
          <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : rows.length === 0 ? (
        <p className={`py-14 text-center text-sm text-slate-500 dark:text-slate-400 ${cardClass}`}>No countries found.</p>
      ) : (
        <div className={countries.isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className={`overflow-x-auto shadow-sm ${cardClass}`}>
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="px-5 py-3.5">Country</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Featured</th>
                  <th className="px-3 py-3.5">Order</th>
                  <th className="px-3 py-3.5">Updated</th>
                  <th className="px-5 py-3.5 text-right"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((c, idx) => (
                  <tr key={c._id} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-3">
                        <span className="h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                          {c.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={assetUrl(c.image)} alt="" loading="lazy" className="h-full w-full object-cover" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                            <Flag code={c.code} name={c.name} className="h-3.5 w-5" /> {c.name}
                          </span>
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">/destinations/{c.slug}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-3.5"><PublishBadge published={c.isPublished} /></td>
                    <td className="px-3 py-3.5">
                      <Star
                        aria-label={c.isFeatured ? "Featured" : "Not featured"}
                        className={`h-4 w-4 ${c.isFeatured ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                      />
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 dark:text-slate-400">{c.order}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-600 dark:text-slate-400">
                      {new Date(c.updatedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        {(c.isPublished || can("country:update") || can("country:delete")) && (
                          <Dropdown
                            label={`Actions for ${c.name}`}
                            width="w-52"
                            up={idx >= rows.length - 2 && rows.length > 3}
                            buttonClassName="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            button={<Ellipsis className="h-5 w-5" />}
                          >
                            {can("country:update") && (
                              <>
                                <button type="button" onClick={() => setEditing(c)} className={menuItemClass}>
                                  <Pencil className="h-4 w-4" /> Edit
                                </button>
                                <button type="button" onClick={() => toggle(c, "isPublished")} className={menuItemClass}>
                                  {c.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  {c.isPublished ? "Unpublish" : "Publish"}
                                </button>
                                <button type="button" onClick={() => toggle(c, "isFeatured")} className={menuItemClass}>
                                  <Star className="h-4 w-4" /> {c.isFeatured ? "Remove from featured" : "Mark as featured"}
                                </button>
                              </>
                            )}
                            {c.isPublished && (
                              <a href={`/destinations/${c.slug}`} target="_blank" rel="noreferrer" className={menuItemClass}>
                                <ExternalLink className="h-4 w-4" /> View on website
                              </a>
                            )}
                            {can("country:delete") && (
                              <button type="button" onClick={() => setDeleting(c)} className={`${menuItemClass} !text-rose-600 dark:!text-rose-400`}>
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
              <span>Page {meta.page} of {meta.totalPage} ({meta.total} countries)</span>
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
        <CountryFormModal
          country={editing === "new" ? undefined : editing}
          nextOrder={(meta?.total ?? 0) + 1}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <Modal title="Delete country" onClose={() => !remove.isPending && setDeleting(null)}>
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
