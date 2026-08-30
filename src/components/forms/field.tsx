import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-col gap-1.5", className)} {...props} />;
}

export function FormLabel({
  children,
  required,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label> & { required?: boolean }) {
  return (
    <Label {...props}>
      {children}
      {required ? (
        <span className="text-amber-deep" aria-hidden="true">
          {" *"}
        </span>
      ) : null}
    </Label>
  );
}

/** A correction note, in the drawing's red. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[0.8125rem] leading-snug text-alarm">
      {message}
    </p>
  );
}
