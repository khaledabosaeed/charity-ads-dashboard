import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const variants = {
  /* The amber mass. The primary action is a drawn block, not a pill. */
  default:
    "bg-amber text-rail-ink border border-amber-deep hover:bg-amber-deep hover:text-rail-ink active:translate-y-px",
  outline:
    "border border-line-2 bg-paper-raised text-ink hover:border-line-3 hover:bg-paper-sunk active:translate-y-px",
  ghost: "border border-transparent text-ink-2 hover:bg-paper-sunk hover:text-ink",
  datum:
    "bg-datum text-white border border-datum hover:bg-datum-2 active:translate-y-px dark:text-paper-sunk",
  destructive:
    "bg-alarm text-white border border-alarm hover:opacity-90 active:translate-y-px dark:text-paper-sunk",
} as const;

const sizes = {
  default: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-[0.8125rem]",
  icon: "h-9 w-9",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
  /** Marks work in progress: a hairline is ruled along the button's edge. */
  pending?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, pending, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-pending={pending ? "" : undefined}
        aria-busy={pending || undefined}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-[2px] font-medium",
          "transition-[background-color,border-color,color,transform] duration-150",
          "disabled:pointer-events-none disabled:opacity-45",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
