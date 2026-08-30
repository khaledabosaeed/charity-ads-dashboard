import * as React from "react";
import { cn } from "@/lib/utils";

/* The drawing schedule. A heavy rule under the header, hairlines between rows,
   and every figure column tabular so the digits stack into a readable column. */

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full max-w-full overflow-x-auto overscroll-x-contain border border-line bg-paper-raised">
      <table className={cn("w-full min-w-max text-[0.8125rem]", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b-2 border-line-3 bg-paper-sunk", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-line", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("group/row transition-colors hover:bg-amber-veil", className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  numeric,
  pinned,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean; pinned?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "annot h-9 whitespace-nowrap px-3 align-middle text-start font-medium text-ink-2",
        numeric && "text-end",
        pinned && "sticky start-0 z-10 border-e border-line bg-paper-sunk",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  numeric,
  pinned,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean; pinned?: boolean }) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 align-middle text-ink",
        numeric && "figure text-end tabular-nums",
        pinned &&
          "sticky start-0 z-10 border-e border-line bg-paper-raised group-hover/row:bg-amber-veil",
        className
      )}
      {...props}
    />
  );
}

/** A totals row: closed by the double rule that means "this is a total". */
export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t-2 border-double border-line-3 bg-paper-sunk font-semibold",
        className
      )}
      {...props}
    />
  );
}
