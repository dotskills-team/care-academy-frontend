"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/admin/ui/Modal";
import { useCreateUser, useUpdateUser } from "@/lib/admin/users";
import { formatRole } from "@/lib/auth/format";
import { ApiError } from "@/lib/api/types";
import type { ManagedUser } from "@/lib/api/users";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800/60";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-200";
const errClass = "mt-1 block text-xs text-rose-600 dark:text-rose-400";

interface Props {
  /** undefined = create */
  user?: ManagedUser;
  /** Roles the signed-in user may assign (already filtered). */
  roles: { _id: string; name: string }[];
  rolesLoading: boolean;
  isSelf: boolean;
  onClose: () => void;
}

export default function UserFormModal({ user, roles, rolesLoading, isSelf, onClose }: Props) {
  const isNew = !user;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role._id ?? "");

  const create = useCreateUser();
  const update = useUpdateUser();
  const busy = create.isPending || update.isPending;
  const err = create.error ?? update.error;
  const fieldError = (f: string) => (err instanceof ApiError ? err.fieldMessage(f) : undefined);

  // The user's current role stays in the list so the select can show it even if it isn't assignable.
  const roleOptions = user && !roles.some((r) => r._id === user.role._id) ? [user.role, ...roles] : roles;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isNew) {
        await create.mutateAsync({ name: name.trim(), email: email.trim(), password, role });
        toast.success(`User "${name.trim()}" created`);
      } else {
        // Send only what changed: the server rejects any role field when editing yourself.
        const payload: Record<string, string> = {};
        if (name.trim() !== user.name) payload.name = name.trim();
        if (email.trim().toLowerCase() !== user.email) payload.email = email.trim();
        if (!isSelf && role !== user.role._id) payload.role = role;
        if (Object.keys(payload).length) {
          await update.mutateAsync({ id: user._id, payload });
          toast.success("User updated");
        }
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the user.");
    }
  }

  const valid = name.trim().length >= 2 && email.includes("@") && !!role && (!isNew || password.length >= 8);

  return (
    <Modal title={isNew ? "Add user" : `Edit ${user.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className={labelClass}>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoFocus />
          {fieldError("name") && <span className={errClass}>{fieldError("name")}</span>}
        </label>
        <label className={labelClass}>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          {fieldError("email") && <span className={errClass}>{fieldError("email")}</span>}
        </label>
        {isNew && (
          <label className={labelClass}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">At least 8 characters.</span>
            {fieldError("password") && <span className={errClass}>{fieldError("password")}</span>}
          </label>
        )}
        <label className={labelClass}>
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isSelf || rolesLoading}
            className={inputClass}
          >
            {isNew && <option value="">{rolesLoading ? "Loading roles…" : "Select a role"}</option>}
            {roleOptions.map((r) => (
              <option key={r._id} value={r._id}>
                {formatRole(r.name)}
              </option>
            ))}
          </select>
          {isSelf && <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">You cannot change your own role.</span>}
          {fieldError("role") && <span className={errClass}>{fieldError("role")}</span>}
        </label>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !valid}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isNew ? "Create user" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
