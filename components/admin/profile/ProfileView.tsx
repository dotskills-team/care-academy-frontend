"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock, Eye, EyeOff, KeyRound, LoaderCircle, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import Panel from "@/components/admin/dashboard/Panel";
import RoleBadge, { StatusBadge } from "@/components/admin/users/RoleBadge";
import { authApi, type AuthUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import { authKeys, useCurrentUser } from "@/lib/auth/hooks";
import { initials } from "@/lib/auth/format";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800/60";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-200";
const errClass = "mt-1 block text-xs text-rose-600 dark:text-rose-400";
const primaryBtn =
  "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60";

const fmt = (iso?: string, time = false) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(time ? { hour: "numeric", minute: "2-digit" } : {}),
      })
    : "—";

// "teamMember" -> "Team Member"
const humanize = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

function InfoRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-2.5 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="w-28 shrink-0 text-slate-500 dark:text-slate-400">{label}</span>
      <span className="min-w-0 truncate font-medium text-slate-800 dark:text-slate-100">{children}</span>
    </li>
  );
}

function DetailsForm({ user }: { user: AuthUser }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name);
  const save = useMutation({
    mutationFn: () => authApi.updateMe({ name: name.trim() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me }),
  });
  const nameError = save.error instanceof ApiError ? save.error.fieldMessage("name") : undefined;
  const dirty = name.trim() !== user.name;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await save.mutateAsync();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update your profile.");
    }
  }

  return (
    <Panel title="Personal details" subtitle="Your name is shown across the admin panel." icon="User">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          {nameError && <span className={errClass}>{nameError}</span>}
        </label>
        <label className={labelClass}>
          Email
          <input value={user.email} disabled className={inputClass} />
          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
            Ask an admin if your email needs to change.
          </span>
        </label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={save.isPending || !dirty || name.trim().length < 2} className={primaryBtn}>
            {save.isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </form>
    </Panel>
  );
}

function PasswordForm() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const change = useMutation({ mutationFn: authApi.changePassword });
  const mismatch = confirm.length > 0 && confirm !== newPassword;
  const valid = oldPassword.length > 0 && newPassword.length >= 8 && newPassword === confirm;
  const newError = change.error instanceof ApiError ? change.error.fieldMessage("newPassword") : undefined;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await change.mutateAsync({ oldPassword, newPassword });
      toast.success("Password changed");
      setOld("");
      setNew("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change your password.");
    }
  }

  const type = show ? "text" : "password";

  return (
    <Panel
      title="Change password"
      subtitle="Use at least 8 characters."
      icon="KeyRound"
      action={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {show ? "Hide" : "Show"}
        </button>
      }
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          Current password
          <input type={type} value={oldPassword} onChange={(e) => setOld(e.target.value)} autoComplete="current-password" className={inputClass} />
        </label>
        <label className={labelClass}>
          New password
          <input type={type} value={newPassword} onChange={(e) => setNew(e.target.value)} autoComplete="new-password" className={inputClass} />
          {newError && <span className={errClass}>{newError}</span>}
        </label>
        <label className={labelClass}>
          Confirm new password
          <input type={type} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className={inputClass} />
          {mismatch && <span className={errClass}>Passwords do not match.</span>}
        </label>
        <div className="sm:col-span-3">
          <button type="submit" disabled={change.isPending || !valid} className={primaryBtn}>
            {change.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Update password
          </button>
        </div>
      </form>
    </Panel>
  );
}

function Permissions({ permissions }: { permissions: string[] }) {
  const grouped = permissions.reduce<Record<string, string[]>>((acc, p) => {
    const [resource, action] = p.split(":");
    (acc[resource] ??= []).push(action);
    return acc;
  }, {});
  const entries = Object.entries(grouped);

  return (
    <Panel title="Your access" subtitle={`${permissions.length} permissions from your role`} icon="ShieldCheck">
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Your role has no permissions.</p>
      ) : (
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {entries.map(([resource, actions]) => (
            <li key={resource} className="flex flex-wrap items-center gap-1.5 text-sm">
              <span className="mr-1 font-medium text-slate-800 dark:text-slate-100">{humanize(resource)}</span>
              {actions.map((a) => (
                <span
                  key={a}
                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {a}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export default function ProfileView() {
  const { data: user, isPending } = useCurrentUser();

  if (isPending || !user) {
    return (
      <div className="grid place-items-center py-24" role="status" aria-label="Loading profile">
        <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your account details, password and what your role lets you do.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700 ring-4 ring-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-500/10">
              {initials(user.name)}
            </span>
            <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <RoleBadge name={user.role.name} />
              <StatusBadge active={user.isActive} />
            </div>
          </div>
          <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
            <InfoRow icon={Mail} label="Email">{user.email}</InfoRow>
            <InfoRow icon={UserRound} label="Role">{user.role.name}</InfoRow>
            <InfoRow icon={CalendarDays} label="Member since">{fmt(user.createdAt)}</InfoRow>
            <InfoRow icon={Clock} label="Last login">{fmt(user.lastLoginAt, true)}</InfoRow>
          </ul>
        </section>

        <div className="space-y-5">
          <DetailsForm key={user.name} user={user} />
          <PasswordForm />
          <Permissions permissions={user.role.permissions} />
        </div>
      </div>
    </div>
  );
}
