import * as React from "react";
import { cn } from "@/lib/utils";
import { sanitizeDecimalInput, sanitizeIntegerInput } from "@/lib/numeric-input";

/** A field on the sheet: a ruled blank, squared off, that inks amber when active. */
export const fieldClass =
  "flex h-10 w-full rounded-[2px] border border-line-2 bg-paper px-3 py-2 text-sm text-ink " +
  "transition-colors placeholder:text-ink-3 hover:border-line-3/40 " +
  "focus-visible:border-amber-deep focus-visible:bg-paper-raised " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "[&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        fieldClass,
        /* Numbers are measurements: tabular, LTR, in the figure face. */
        type === "number" && "figure [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

type NumberInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Whole counts (orders). Default is a decimal amount. */
  integer?: boolean;
};

/** A figure blank that only accepts digits — letters, signs, and `e` never land. */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ integer, onChange, className, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode={integer ? "numeric" : "decimal"}
      autoComplete="off"
      spellCheck={false}
      className={cn("figure", className)}
      onChange={(e) => {
        const next = integer
          ? sanitizeIntegerInput(e.target.value)
          : sanitizeDecimalInput(e.target.value);
        if (e.target.value !== next) e.target.value = next;
        onChange?.(e);
      }}
    />
  )
);
NumberInput.displayName = "NumberInput";

/** A native select styled as the same ruled blank, with a drawn chevron. */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(fieldClass, "appearance-none pe-9 leading-normal", className)}
      {...props}
    >
      {children}
    </select>
    <svg
      viewBox="0 0 10 6"
      aria-hidden="true"
      className="pointer-events-none absolute end-3 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-ink-2"
    >
      <path d="M0 0.5 L5 5.5 L10 0.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  </div>
));
NativeSelect.displayName = "NativeSelect";
