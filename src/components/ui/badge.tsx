import * as React from "react";
import { cn } from "@/lib/utils";

/* Status is stated, not decorated: a squared tag with a hairline, in the
   drawing's own inks. Never a pill, never a lone colour dot. */
const variants = {
  default: "border-amber-deep/50 bg-amber-veil text-amber-ink",
  success: "border-datum/40 bg-datum-wash text-datum",
  muted: "border-line-2 bg-paper-sunk text-ink-2",
  destructive: "border-alarm/40 bg-alarm-wash text-alarm",
} as const;

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] border px-2 py-0.5 text-[0.6875rem] font-medium leading-tight",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
