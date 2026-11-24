import type { Metadata } from "next";
import QueryProvider from "@/components/providers/QueryProvider";
import AppToaster from "@/components/providers/AppToaster";
import ThemeScript from "@/components/providers/ThemeScript";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | CARE Admin" },
  robots: { index: false, follow: false },
};

// Everything under /admin requires a session (see (panel)/layout.tsx -> AuthGuard).
// The login page is /login, which has its own layout with the same providers.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <QueryProvider>{children}</QueryProvider>
      <AppToaster />
    </>
  );
}
