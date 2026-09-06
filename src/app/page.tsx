import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { canReadAll } from "@/lib/auth/roles";

/** Each role lands on the sheet it actually works from. */
export default async function Home() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  redirect(canReadAll(profile.role) ? "/dashboard" : "/entry");
}
