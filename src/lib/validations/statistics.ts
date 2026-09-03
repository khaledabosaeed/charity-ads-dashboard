import { z } from "zod";

const money = z.coerce.number({ message: "قيمة رقمية مطلوبة" }).min(0, "يجب ألا تقل القيمة عن صفر");

export const statisticsEntrySchema = z
  .object({
    associationId: z.string().uuid("الجمعية مطلوبة"),
    platformId: z.string().uuid("المنصة الإعلانية مطلوبة"),
    periodStart: z.string().min(1, "تاريخ البداية مطلوب"),
    periodEnd: z.string().min(1, "تاريخ النهاية مطلوب"),
    currencyCode: z
      .string()
      .regex(/^[A-Z]{3}$/, "كود العملة يجب أن يكون 3 أحرف حسب ISO 4217"),
    budget: money,
    amountSpent: money,
    donationCount: z.coerce
      .number({ message: "عدد صحيح مطلوب" })
      .int("عدد التبرعات يجب أن يكون عددًا صحيحًا")
      .min(0, "يجب ألا يقل العدد عن صفر"),
    donationValue: money,
    orderCount: z.coerce
      .number({ message: "عدد صحيح مطلوب" })
      .int("عدد الطلبات يجب أن يكون عددًا صحيحًا")
      .min(0, "يجب ألا يقل العدد عن صفر"),
    advertisingReturn: money,
    associationReturn: money,
    notes: z.string().max(2000, "الملاحظات طويلة جدًا").optional().or(z.literal("")),
  })
  .refine((data) => data.periodEnd >= data.periodStart, {
    message: "تاريخ النهاية لا يجب أن يسبق تاريخ البداية",
    path: ["periodEnd"],
  });

export type StatisticsEntryInput = z.infer<typeof statisticsEntrySchema>;
