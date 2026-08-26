import { requireActiveUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireActiveUser();

  return <AppShell profile={profile}>{children}</AppShell>;
}
