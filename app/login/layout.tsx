import type { Metadata } from "next";
import QueryProvider from "@/components/providers/QueryProvider";
import AppToaster from "@/components/providers/AppToaster";
import ThemeScript from "@/components/providers/ThemeScript";

export const metadata: Metadata = {
  title: { default: "Sign in", template: "%s | CARE Admin" },
  robots: { index: false, follow: false },
};

// Single sign-in page for all staff. Not under (public) (no site navbar/footer) and not
// under admin/(panel) (no sidebar, no AuthGuard).
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <QueryProvider>{children}</QueryProvider>
      <AppToaster />
    </>
  );
}
