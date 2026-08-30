import { cn } from "@/lib/utils";

/** Not yet drawn: the hatch of an unresolved region. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("hatch animate-pulse rounded-[2px] bg-paper-sunk", className)}
      {...props}
    />
  );
}
