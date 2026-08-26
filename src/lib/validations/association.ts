import { z } from "zod";

export const associationSchema = z.object({
  name: z.string().min(2, "اسم الجمعية مطلوب"),
  code: z
    .string()
    .max(50, "الرمز طويل جدًا")
    .optional()
    .or(z.literal("")),
  description: z.string().max(2000, "الوصف طويل جدًا").optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional(),
});

export type AssociationInput = z.infer<typeof associationSchema>;

export const platformSchema = z.object({
  name: z.string().min(2, "اسم المنصة مطلوب"),
  slug: z
    .string()
    .min(2, "المعرف مطلوب")
    .regex(/^[a-z0-9-]+$/, "المعرف يجب أن يحتوي أحرف إنجليزية صغيرة وأرقام وشرطات فقط"),
});

export type PlatformInput = z.infer<typeof platformSchema>;
