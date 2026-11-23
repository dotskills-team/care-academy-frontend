import RolesManager from "@/components/admin/roles/RolesManager";

export const metadata = { title: "Roles & Permissions" };

export default function RolesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Roles &amp; Permissions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Control what each role can see and do. Changes apply to users with that role immediately.
        </p>
      </div>
      <RolesManager />
    </div>
  );
}
