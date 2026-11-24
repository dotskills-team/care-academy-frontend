import AdminShell from "@/components/admin/layout/AdminShell";
import AuthGuard from "@/components/admin/auth/AuthGuard";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
