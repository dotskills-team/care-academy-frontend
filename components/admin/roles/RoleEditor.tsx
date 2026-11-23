"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, LoaderCircle, Lock, Minus, Trash2 } from "lucide-react";
import Panel from "@/components/admin/dashboard/Panel";
import { useCreateRole, useDeleteRole, useUpdateRole } from "@/lib/admin/roles";
import { ApiError } from "@/lib/api/types";
import type { PermissionRegistry, Role } from "@/lib/api/roles";

// "teamMember" -> "Team Member"
const humanize = (s: string) =>
  s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800/60";

interface Props {
  /** undefined means "creating a new role" */
  role?: Role;
  registry: PermissionRegistry;
  userPermissions: string[];
  isSuperAdmin: boolean;
  ownRoleId?: string;
  can: (permission: string) => boolean;
  onSaved: (id: string) => void;
  onDeleted: () => void;
  onCancelNew: () => void;
}

export default function RoleEditor({
  role,
  registry,
  userPermissions,
  isSuperAdmin,
  ownRoleId,
  can,
  onSaved,
  onDeleted,
  onCancelNew,
}: Props) {
  const isNew = !role;
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [perms, setPerms] = useState<Set<string>>(new Set(role?.permissions ?? []));
  const [confirmDelete, setConfirmDelete] = useState(false);

  const create = useCreateRole();
  const update = useUpdateRole();
  const remove = useDeleteRole();
  const busy = create.isPending || update.isPending || remove.isPending;

  // Mirrors the server's rules; the server stays the authority and its errors are shown as-is.
  const isSuperRole = !!role && role.isSystem && role.name === "SUPER_ADMIN";
  const isOwnRole = !!role && role._id === ownRoleId;
  const lockedReason = isSuperRole
    ? "The Super Admin role always has full access and cannot be changed."
    : !isNew && !can("role:update")
      ? "You don't have permission to edit roles."
      : !isNew && !isSuperAdmin && isOwnRole
        ? "You cannot modify your own role."
        : null;
  const readOnly = !!lockedReason;
  // Non-super-admins can only grant permissions they hold themselves.
  const grantable = (p: string) => isSuperAdmin || userPermissions.includes(p);

  const toggle = (p: string, on: boolean) =>
    setPerms((prev) => {
      const next = new Set(prev);
      if (on) next.add(p);
      else next.delete(p);
      return next;
    });

  const toggleGroup = (resource: string, on: boolean) =>
    setPerms((prev) => {
      const next = new Set(prev);
      for (const a of registry.grouped[resource]) {
        const p = `${resource}:${a}`;
        if (on && grantable(p)) next.add(p);
        if (!on && (grantable(p) || !role?.permissions.includes(p))) next.delete(p);
      }
      return next;
    });

  const fieldError = (err: unknown, field: string) =>
    err instanceof ApiError ? err.fieldMessage(field) : undefined;
  const error = create.error ?? update.error ?? remove.error;
  const nameError = fieldError(error, "name");

  async function save() {
    const payload = {
      name: name.trim(),
      description: description.trim(),
      permissions: [...perms],
    };
    try {
      if (isNew) {
        const created = await create.mutateAsync(payload);
        toast.success(`Role "${created.name}" created`);
        onSaved(created._id);
      } else {
        // System roles cannot be renamed, so leave the name out for them.
        await update.mutateAsync({
          id: role._id,
          payload: role.isSystem ? { description: payload.description, permissions: payload.permissions } : payload,
        });
        toast.success("Role saved. Changes apply immediately.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the role.");
    }
  }

  async function destroy() {
    if (!role) return;
    try {
      await remove.mutateAsync(role._id);
      toast.success(`Role "${role.name}" deleted`);
      onDeleted();
    } catch (err) {
      setConfirmDelete(false);
      toast.error(err instanceof Error ? err.message : "Could not delete the role.");
    }
  }

  const canDelete = !isNew && !role.isSystem && can("role:delete") && (isSuperAdmin || !isOwnRole);
  const canSave = !readOnly && (isNew ? can("role:create") : true) && name.trim().length >= 2;

  return (
    <Panel
      title={isNew ? "New role" : `Edit ${role.name}`}
      subtitle={`${perms.size} of ${registry.permissions.length} permissions selected`}
      icon="ShieldCheck"
    >
      {lockedReason && (
        <p className="mb-4 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Lock className="h-4 w-4 shrink-0" /> {lockedReason}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={readOnly || (!isNew && role.isSystem)}
            maxLength={50}
            placeholder="e.g. Content Manager"
            className={`${inputClass} mt-1`}
          />
          {nameError && <span className="mt-1 block text-xs text-rose-600 dark:text-rose-400">{nameError}</span>}
          {!isNew && role.isSystem && (
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">System roles cannot be renamed.</span>
          )}
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={readOnly}
            maxLength={200}
            placeholder="What is this role for?"
            className={`${inputClass} mt-1`}
          />
        </label>
      </div>

      <h3 className="mb-2 mt-6 text-sm font-bold text-slate-900 dark:text-slate-100">Permissions</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2.5">Resource</th>
              <th className="px-3 py-2.5">Actions</th>
              <th className="px-3 py-2.5 text-right">All</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Object.entries(registry.grouped).map(([resource, actions]) => {
              const keys = actions.map((a) => `${resource}:${a}`);
              const count = keys.filter((k) => perms.has(k)).length;
              const toggleable = keys.filter(grantable);
              return (
                <tr key={resource}>
                  <td className="whitespace-nowrap px-3 py-2.5 font-medium text-slate-800 dark:text-slate-100">
                    {humanize(resource)}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {actions.map((a, i) => {
                        const p = keys[i];
                        const locked = readOnly || (!grantable(p) && !perms.has(p));
                        return (
                          <label
                            key={p}
                            className={`inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 ${
                              locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={perms.has(p)}
                              disabled={locked}
                              onChange={(e) => toggle(p, e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                            />
                            {humanize(a)}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={count === keys.length ? true : count === 0 ? false : "mixed"}
                      aria-label={`Toggle all ${humanize(resource)} permissions`}
                      disabled={readOnly || toggleable.length === 0}
                      onClick={() => toggleGroup(resource, count !== keys.length)}
                      className={`grid h-5 w-5 place-items-center rounded border align-middle disabled:cursor-not-allowed disabled:opacity-50 ${
                        count === 0
                          ? "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                          : "border-indigo-600 bg-indigo-600 text-white"
                      }`}
                    >
                      {count === keys.length ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : count > 0 ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : null}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {canDelete &&
            (confirmDelete ? (
              <span className="inline-flex items-center gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-300">Delete this role?</span>
                <button
                  onClick={destroy}
                  disabled={busy}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700 disabled:opacity-70"
                >
                  {remove.isPending ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={busy}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="h-4 w-4" /> Delete role
              </button>
            ))}
        </div>
        <div className="flex items-center gap-2">
          {isNew && (
            <button
              onClick={onCancelNew}
              disabled={busy}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
          {!readOnly && (
            <button
              onClick={save}
              disabled={busy || !canSave}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {(create.isPending || update.isPending) && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isNew ? "Create role" : "Save changes"}
            </button>
          )}
        </div>
      </div>
    </Panel>
  );
}
