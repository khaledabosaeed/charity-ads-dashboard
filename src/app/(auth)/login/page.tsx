import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { LoginScreen } from "./login-screen";

export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect("/dashboard");

  return <LoginScreen />;
}
