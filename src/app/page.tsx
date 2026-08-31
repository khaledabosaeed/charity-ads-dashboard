import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";

/** Each role lands on the sheet it actually works from. */
export default async function Home() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  redirect(profile.role === "admin" ? "/dashboard" : "/entry");
}
