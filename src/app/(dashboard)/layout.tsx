import { cookies } from "next/headers";
import { requireActiveUser } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { DEFAULT_RAIL, RAIL_COOKIE_NAME, type RailState } from "@/components/layout/rail-config";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, cookieStore] = await Promise.all([requireActiveUser(), cookies()]);
  const rail = (cookieStore.get(RAIL_COOKIE_NAME)?.value as RailState) || DEFAULT_RAIL;

  return (
    <AppShell profile={profile} initialRail={rail}>
      {children}
    </AppShell>
  );
}
