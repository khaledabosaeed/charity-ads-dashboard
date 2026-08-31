"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { useI18n } from "@/i18n";
import { fieldClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A date on this sheet is always ISO, because every other date in the product
 * is. A native `type="date"` cannot deliver that: Chromium draws the segment
 * order from the browser's own UI locale and ignores the element's `lang`, so
 * an Arabic sheet ends up printing mm/dd/yyyy.
 *
 * So the visible control is a text field the drawing owns — figure face, ISO
 * placeholder, ISO value on submit — and the native picker is kept behind a
 * calendar button that opens it. Typing and picking both write the same string.
 */
export function DateField({
  id,
  name,
  defaultValue,
  required,
  className,
  onValueChange,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  /** Fires on every keystroke and pick — callers decide what counts as a date. */
  onValueChange?: (value: string) => void;
}) {
  const { dict } = useI18n();
  const [value, setValue] = React.useState(defaultValue ?? "");
  const pickerRef = React.useRef<HTMLInputElement>(null);

  function write(next: string) {
    setValue(next);
    onValueChange?.(next);
  }

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        dir="ltr"
        required={required}
        value={value}
        onChange={(e) => write(e.target.value)}
        placeholder={dict.common.dateFormat}
        pattern="\d{4}-\d{2}-\d{2}"
        title={dict.common.dateFormat}
        className={cn(fieldClass, "figure pr-10 placeholder:text-ink-3", className)}
      />

      {/* The native picker, kept for the calendar affordance but never drawn. */}
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={ISO.test(value) ? value : ""}
        onChange={(e) => write(e.target.value)}
        className="pointer-events-none absolute bottom-1 right-9 h-0 w-0 border-0 p-0 opacity-0"
      />

      <button
        type="button"
        aria-label={dict.common.pickDate}
        title={dict.common.pickDate}
        onClick={() => pickerRef.current?.showPicker?.()}
        className="absolute right-0 top-0 flex h-10 w-9 items-center justify-center text-ink-2 transition-colors hover:text-amber-ink"
      >
        <CalendarDays className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}
