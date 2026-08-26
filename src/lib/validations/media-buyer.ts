import { z } from "zod";

export const createMediaBuyerSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  email: z.email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
  associationIds: z.array(z.string().uuid()).optional(),
});

export type CreateMediaBuyerInput = z.infer<typeof createMediaBuyerSchema>;

export const updateMediaBuyerSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  isActive: z.coerce.boolean().optional(),
  associationIds: z.array(z.string().uuid()).optional(),
});

export type UpdateMediaBuyerInput = z.infer<typeof updateMediaBuyerSchema>;
