import { describe, expect, it } from "vitest";
import { rollup, rollupBy, unifiedCurrency } from "./rollup";

const entry = (
  period_start: string,
  amount_spent: number,
  advertising_return: number,
  currency_code = "USD"
) => ({
  period_start,
  amount_spent,
  advertising_return,
  order_count: 0,
  donation_value: 0,
  currency_code,
});

describe("rollup", () => {
  it("sums spend and return and counts only days with movement", () => {
    const r = rollup([
      entry("2026-01-01", 100, 250),
      entry("2026-01-01", 50, 50),
      entry("2026-01-02", 0, 0),
    ]);
    expect(r.spend).toBe(150);
    expect(r.revenue).toBe(300);
    expect(r.orders).toBe(0);
    expect(r.roas).toBe(2);
    expect(r.activeDays).toBe(1);
    expect(r.entries).toBe(3);
  });

  it("reports an undefined ROAS while nothing was spent", () => {
    expect(rollup([entry("2026-01-01", 0, 400)]).roas).toBeNull();
    expect(rollup([]).roas).toBeNull();
  });
});

describe("rollupBy", () => {
  const entries = [
    { ...entry("2026-01-01", 100, 400), platform: "meta" },
    { ...entry("2026-01-02", 100, 100), platform: "tiktok" },
  ];

  it("ranks groups by return", () => {
    const groups = rollupBy(entries, (e) => ({ id: e.platform, label: e.platform }));
    expect(groups.map((g) => g.id)).toEqual(["meta", "tiktok"]);
    expect(groups[0].totals.roas).toBe(4);
  });

  it("keeps seeded groups that have no entries at all", () => {
    const groups = rollupBy(entries, (e) => ({ id: e.platform, label: e.platform }), [
      { id: "x", label: "X" },
    ]);
    expect(groups.at(-1)).toMatchObject({ id: "x", totals: { entries: 0, activeDays: 0 } });
  });
});

describe("unifiedCurrency", () => {
  it("returns the shared code, or null for mixed books", () => {
    expect(unifiedCurrency([entry("2026-01-01", 1, 1), entry("2026-01-02", 1, 1)])).toBe("USD");
    expect(unifiedCurrency([entry("2026-01-01", 1, 1), entry("2026-01-02", 1, 1, "SAR")])).toBeNull();
    expect(unifiedCurrency([])).toBeNull();
  });
});
