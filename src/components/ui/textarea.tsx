import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldClass } from "@/components/ui/input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldClass, "h-auto min-h-20 resize-y leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
