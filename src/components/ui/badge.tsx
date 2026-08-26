import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
} as const;

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
