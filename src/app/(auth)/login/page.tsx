import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { LoginForm } from "./login-form";
import { LoginHeading } from "./login-heading";

export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="flex w-full justify-end">
            <LocaleSwitcher />
          </div>
          <LoginHeading />
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
