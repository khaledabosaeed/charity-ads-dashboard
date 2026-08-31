import { describe, expect, it } from "vitest";
import { currencyMark, formatMoney } from "./format";

describe("currency", () => {
  it("reads the riyal in the reader's own script", () => {
    expect(currencyMark("SAR", "ar")).toBe("ر.س");
    expect(currencyMark("SAR", "en")).toBe("SAR");
  });

  it("falls back to the ISO code for any other book", () => {
    expect(currencyMark("USD", "ar")).toBe("USD");
  });

  it("annotates the figure with its unit, keeping the figure Latin and tabular", () => {
    expect(formatMoney(1234.5, "SAR", "ar")).toBe("1,234.50 ر.س");
    expect(formatMoney(1234.5, "SAR", "en")).toBe("1,234.50 SAR");
  });
});
