import { Mark } from "@/components/brand/mark";
import { cn } from "@/lib/utils";

/**
 * The company stamp: the mark sits on its own square of paper, the way a
 * drawing carries the practice's stamp in the corner of the sheet. Keeping the
 * paper plate means the mark always shows in its true amber and green, whatever
 * field it is placed on.
 */
export function Stamp({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center border border-line-2 bg-paper-raised",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Mark className="h-[72%] w-[72%]" title="مؤسسة الشرق الذكي التجارية" />
    </span>
  );
}

export function Lockup({
  companyClassName,
  productClassName,
  productLine,
  size = 40,
  className,
}: {
  companyClassName?: string;
  productClassName?: string;
  productLine: string;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Stamp size={size} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className={cn("text-[0.8125rem] font-semibold leading-[1.35]", companyClassName)}>
          مؤسسة الشرق الذكي التجارية
        </span>
        <span className={cn("annot", productClassName)}>{productLine}</span>
      </span>
    </span>
  );
}
