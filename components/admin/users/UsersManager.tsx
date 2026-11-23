"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  LayoutGrid,
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  Search,
  Table2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import Dropdown, { menuItemClass } from "@/components/admin/layout/Dropdown";
import Modal from "@/components/admin/ui/Modal";
import RoleBadge, { StatusBadge } from "./RoleBadge";
import UserFormModal from "./UserFormModal";
import UserStats from "./UserStats";
import { useRoles } from "@/lib/admin/roles";
import { isStrictSubset, useDeleteUser, useUpdateUser, useUsers } from "@/lib/admin/users";
import { useCurrentUser } from "@/lib/auth/hooks";
import { formatRole, initials } from "@/lib/auth/format";
import { ApiError } from "@/lib/api/types";
import type { ManagedUser } from "@/lib/api/users";

const LIMIT = 10;
const controlClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200";

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : "Never";

// Avatar colour is derived from the name so it stays stable between renders.
const avatarTones = [
  "bg-indigo-100 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-500/30",
  "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/30",
  "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/30",
  "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:ring-rose-500/30",
  "bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:ring-sky-500/30",
  "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:ring-violet-500/30",
];
const avatarTone = (name: string) =>
  avatarTones[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % avatarTones.length];

function Avatar({ name, size = "h-10 w-10" }: { name: string; size?: string }) {
  return (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full text-xs font-bold ring-2 ${avatarTone(name)}`}>
      {initials(name)}
    </span>
  );
}

export default function UsersManager() {
  const { data: me } = useCurrentUser();
  const own = me?.role.permissions ?? [];
  const isSuperAdmin = !!me && me.role.isSystem && me.role.name === "SUPER_ADMIN";
  const can = (p: string) => isSuperAdmin || own.includes(p);

  const [view, setView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<ManagedUser | "new" | null>(null);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const users = useUsers({
    page,
    limit: LIMIT,
    searchTerm: debounced,
    role: roleFilter || undefined,
    isActive: status || undefined,
  });
  // Needs role:read; without it the role filter/select just stays empty.
  const roles = useRoles();
  const update = useUpdateUser();
  const remove = useDeleteUser();

  // Same rules the server enforces: never super admin, and (unless super admin) only roles
  // with strictly fewer permissions than the requester's own.
  const roleManageable = (r: { name: string; isSystem: boolean; permissions: string[] }) =>
    !(r.isSystem && r.name === "SUPER_ADMIN") && (isSuperAdmin || isStrictSubset(r.permissions, own));
  const assignableRoles = useMemo(() => (roles.data ?? []).filter(roleManageable), [roles.data, own, isSuperAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSelf = (u: ManagedUser) => u._id === me?._id;
  const canEdit = (u: ManagedUser) => can("user:update") && (isSelf(u) || roleManageable(u.role));
  const canDelete = (u: ManagedUser) => can("user:delete") && !isSelf(u) && roleManageable(u.role);

  async function toggleActive(u: ManagedUser) {
    try {
      await update.mutateAsync({ id: u._id, payload: { isActive: !u.isActive } });
      toast.success(`${u.name} ${u.isActive ? "deactivated" : "activated"}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the user.");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting._id);
      toast.success(`${deleting.name} deleted`);
      setDeleting(null);
      // Don't strand the user on an emptied last page.
      if (users.data && users.data.users.length === 1 && page > 1) setPage(page - 1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the user.");
    }
  }

  const error = users.error;
  const meta = users.data?.meta;
  const rows = users.data?.users ?? [];

  const actionsMenu = (u: ManagedUser, up: boolean) =>
    canEdit(u) || canDelete(u) ? (
      <Dropdown
        label={`Actions for ${u.name}`}
        width="w-48"
        up={up}
        buttonClassName="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        button={<Ellipsis className="h-5 w-5" />}
      >
        {canEdit(u) && (
          <button type="button" onClick={() => setEditing(u)} className={menuItemClass}>
            <Pencil className="h-4 w-4" /> Edit
          </button>
        )}
        {canEdit(u) && !isSelf(u) && (
          <button type="button" onClick={() => toggleActive(u)} className={menuItemClass}>
            <Power className="h-4 w-4" /> {u.isActive ? "Deactivate" : "Activate"}
          </button>
        )}
        {canDelete(u) && (
          <button type="button" onClick={() => setDeleting(u)} className={`${menuItemClass} !text-rose-600 dark:!text-rose-400`}>
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        )}
      </Dropdown>
    ) : null;

  const youTag = (u: ManagedUser) =>
    isSelf(u) && (
      <span className="ml-1.5 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
        You
      </span>
    );

  const forbidden = error instanceof ApiError && error.status === 403;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage who has access to the CARE Academy admin panel and what they can do.
          </p>
        </div>
        {can("user:create") && (
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add user
          </button>
        )}
      </div>

      <UserStats />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users"
            className={`${controlClass} w-full pl-10`}
          />
        </div>
        {roles.data && (
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by role"
            className={controlClass}
          >
            <option value="">All roles</option>
            {roles.data.map((r) => (
              <option key={r._id} value={r._id}>
                {formatRole(r.name)}
              </option>
            ))}
          </select>
        )}
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
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          {(
            [
              ["table", "Table", Table2],
              ["grid", "Grid", LayoutGrid],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                view === key
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        {meta && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {rows.length} of {meta.total} user{meta.total === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {error && !users.data ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <TriangleAlert className="h-8 w-8 text-amber-500" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {forbidden ? "You don't have permission to view users." : error.message}
          </p>
          {!forbidden && (
            <button
              onClick={() => users.refetch()}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          )}
        </div>
      ) : users.isPending ? (
        <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900" role="status" aria-label="Loading users">
          <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : (
        <div className={users.isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {rows.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white py-14 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              No users found.
            </p>
          ) : view === "table" ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-3 py-3.5">Role</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5">Joined</th>
                    <th className="px-3 py-3.5">Last login</th>
                    <th className="px-5 py-3.5 text-right"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((u, idx) => (
                    <tr key={u._id} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-3">
                          <Avatar name={u.name} />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-slate-900 dark:text-slate-100">
                              {u.name}
                              {youTag(u)}
                            </span>
                            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-3.5"><RoleBadge name={u.role.name} /></td>
                      <td className="px-3 py-3.5"><StatusBadge active={u.isActive} /></td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-slate-600 dark:text-slate-400">{fmtDate(u.createdAt)}</td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-slate-600 dark:text-slate-400">{fmtDate(u.lastLoginAt)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end">{actionsMenu(u, idx >= rows.length - 2 && rows.length > 3)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map((u, idx) => (
                <div
                  key={u._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar name={u.name} size="h-12 w-12" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-slate-900 dark:text-slate-100">
                          {u.name}
                          {youTag(u)}
                        </span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{u.email}</span>
                      </span>
                    </span>
                    {actionsMenu(u, idx >= rows.length - 3 && rows.length > 3)}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <RoleBadge name={u.role.name} />
                    <StatusBadge active={u.isActive} />
                  </div>
                  <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    Last login: {fmtDate(u.lastLoginAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {meta && meta.totalPage > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>
                Page {meta.page} of {meta.totalPage}
              </span>
              <span className="flex gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPage}
                  aria-label="Next page"
                  className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </span>
            </div>
          )}
        </div>
      )}

      {editing && (
        <UserFormModal
          user={editing === "new" ? undefined : editing}
          roles={assignableRoles}
          rolesLoading={roles.isPending}
          isSelf={editing !== "new" && isSelf(editing)}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <Modal title="Delete user" onClose={() => !remove.isPending && setDeleting(null)}>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Delete <strong>{deleting.name}</strong> ({deleting.email})? They will no longer be able to sign in.
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
