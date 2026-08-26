import { describe, expect, it } from "vitest";
import { statisticsEntrySchema } from "./statistics";

const base = {
  associationId: "11111111-1111-4111-8111-111111111111",
  platformId: "22222222-2222-4222-8222-222222222222",
  periodStart: "2026-01-01",
  periodEnd: "2026-01-31",
  currencyCode: "USD",
  budget: 1000,
  amountSpent: 400,
  donationCount: 10,
  donationValue: 2000,
  advertisingReturn: 500,
  associationReturn: 300,
  notes: "",
};

describe("statisticsEntrySchema", () => {
  it("accepts a valid entry", () => {
    expect(statisticsEntrySchema.safeParse(base).success).toBe(true);
  });

  it("rejects a negative amountSpent", () => {
    const result = statisticsEntrySchema.safeParse({ ...base, amountSpent: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer donationCount", () => {
    const result = statisticsEntrySchema.safeParse({ ...base, donationCount: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects periodEnd before periodStart", () => {
    const result = statisticsEntrySchema.safeParse({
      ...base,
      periodStart: "2026-02-01",
      periodEnd: "2026-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a currency code that is not 3 uppercase letters", () => {
    const result = statisticsEntrySchema.safeParse({ ...base, currencyCode: "usd" });
    expect(result.success).toBe(false);
  });
});
