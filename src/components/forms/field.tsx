import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function FormLabel({
  children,
  required,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label> & { required?: boolean }) {
  return (
    <Label {...props}>
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </Label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}
