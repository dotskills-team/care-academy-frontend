"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, Lock, Plus, ShieldCheck, TriangleAlert } from "lucide-react";
import Panel from "@/components/admin/dashboard/Panel";
import RoleEditor from "./RoleEditor";
import { usePermissionRegistry, useRoles } from "@/lib/admin/roles";
import { useCurrentUser } from "@/lib/auth/hooks";
import { formatRole } from "@/lib/auth/format";
import { ApiError } from "@/lib/api/types";

const NEW = "new";

export default function RolesManager() {
  const { data: user } = useCurrentUser();
  const roles = useRoles();
  const registry = usePermissionRegistry();
  const [selected, setSelected] = useState<string | null>(null);

  const own = user?.role.permissions ?? [];
  const isSuperAdmin = !!user && user.role.isSystem && user.role.name === "SUPER_ADMIN";
  const can = (p: string) => isSuperAdmin || own.includes(p);

  const list = roles.data ?? [];
  // Default to the first role once the list loads; a deleted selection falls back the same way.
  const activeId = selected === NEW ? NEW : list.some((r) => r._id === selected) ? selected : list[0]?._id ?? null;
  const activeRole = useMemo(() => list.find((r) => r._id === activeId), [list, activeId]);

  const error = roles.error ?? registry.error;
  if (error) {
    const forbidden = error instanceof ApiError && error.status === 403;
    return (
      <Panel title="Roles & Permissions" icon="ShieldCheck">
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <TriangleAlert className="h-8 w-8 text-amber-500" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {forbidden ? "You don't have permission to view roles." : error.message}
          </p>
          {!forbidden && (
            <button
              onClick={() => {
                roles.refetch();
                registry.refetch();
              }}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          )}
        </div>
      </Panel>
    );
  }

  if (roles.isPending || registry.isPending) {
    return (
      <div className="grid place-items-center py-24" role="status" aria-label="Loading roles">
        <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <Panel
        title="Roles"
        subtitle={`${list.length} role${list.length === 1 ? "" : "s"}`}
        icon="ShieldCheck"
        action={
          can("role:create") && (
            <button
              onClick={() => setSelected(NEW)}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> New
            </button>
          )
        }
      >
        <ul className="space-y-1.5">
          {list.map((r) => {
            const active = r._id === activeId;
            return (
              <li key={r._id}>
                <button
                  onClick={() => setSelected(r._id)}
                  aria-current={active}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                    active
                      ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500/50 dark:bg-indigo-500/10"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      {formatRole(r.name)}
                    </span>
                    {r.isSystem && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Lock className="h-3 w-3" /> System
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                    {r.description || "No description"} · {r.permissions.length} permissions
                  </span>
                </button>
              </li>
            );
          })}
          {activeId === NEW && (
            <li className="rounded-xl border border-dashed border-indigo-300 px-3 py-2.5 text-sm font-semibold text-indigo-700 dark:border-indigo-500/50 dark:text-indigo-300">
              New role (unsaved)
            </li>
          )}
        </ul>
      </Panel>

      {activeId && registry.data ? (
        <RoleEditor
          // Remount on selection or after a save so the form re-seeds from the server copy.
          key={`${activeId}:${activeRole?.updatedAt ?? ""}`}
          role={activeRole}
          registry={registry.data}
          userPermissions={own}
          isSuperAdmin={isSuperAdmin}
          ownRoleId={user?.role._id}
          can={can}
          onSaved={(id) => setSelected(id)}
          onDeleted={() => setSelected(null)}
          onCancelNew={() => setSelected(null)}
        />
      ) : (
        <Panel title="No roles yet" icon="ShieldCheck">
          <p className="text-sm text-slate-500 dark:text-slate-400">Create the first role to get started.</p>
        </Panel>
      )}
    </div>
  );
}
