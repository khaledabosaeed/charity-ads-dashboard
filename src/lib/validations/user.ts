import { z } from "zod";

const fullName = z.string().min(2, "الاسم الكامل مطلوب");
const role = z.enum(["admin", "media_buyer"], { message: "الصلاحية مطلوبة" });
const password = z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف");
const email = z.email("بريد إلكتروني غير صحيح");
const associationIds = z.array(z.string().uuid()).optional();

/** A blank credential field means "leave this one as it is". */
const optionalPassword = z
  .union([z.literal(""), password])
  .optional()
  .transform((value) => value || undefined);

const optionalEmail = z
  .union([z.literal(""), email])
  .optional()
  .transform((value) => value || undefined);

export const createUserSchema = z.object({
  fullName,
  role,
  email,
  password,
  associationIds,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  fullName,
  role,
  isActive: z.coerce.boolean().optional(),
  email: optionalEmail,
  password: optionalPassword,
  associationIds,
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Changing your own credentials always costs the current password: the session
 * cookie alone must not be enough to take an account over.
 */
export const accountSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    email: optionalEmail,
    password: optionalPassword,
  })
  .refine((data) => Boolean(data.email || data.password), {
    message: "لا يوجد تغيير لحفظه",
    path: ["email"],
  });

export type AccountInput = z.infer<typeof accountSchema>;
