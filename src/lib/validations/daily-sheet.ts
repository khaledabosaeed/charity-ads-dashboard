import { z } from "zod";

/** One platform's line on the day sheet: what went out, what came back. */
const amount = z.coerce.number({ message: "قيمة رقمية مطلوبة" }).min(0, "يجب ألا تقل القيمة عن صفر");

export const dailySheetRowSchema = z.object({
  platformId: z.string().uuid("منصة غير معروفة"),
  amountSpent: amount,
  advertisingReturn: amount,
  orderCount: amount,
});

export const dailySheetSchema = z.object({
  /** Whose day is being filed. Only an admin may name anyone but themselves. */
  mediaBuyerId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ مطلوب بصيغة YYYY-MM-DD"),
  associationId: z.string().uuid("الجمعية مطلوبة"),
  currencyCode: z.string().regex(/^[A-Z]{3}$/, "كود العملة يجب أن يكون 3 أحرف حسب ISO 4217"),
  rows: z.array(dailySheetRowSchema).min(1, "لا توجد منصات مرتبطة بهذه الجمعية"),
  /** The association's own return for the day — one value, no platform. */
  associationReturn: amount,
});

export type DailySheetInput = z.infer<typeof dailySheetSchema>;
export type DailySheetRowInput = z.infer<typeof dailySheetRowSchema>;
