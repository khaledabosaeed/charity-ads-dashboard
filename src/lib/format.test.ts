import { describe, expect, it } from "vitest";
import { currencyMark, displayPlatformName, formatMoney } from "./format";

describe("currency", () => {
  it("reads the riyal in the reader's own script", () => {
    expect(currencyMark("SAR", "ar")).toBe("ر.س");
    expect(currencyMark("SAR", "en")).toBe("SAR");
  });

  it("reads leftover USD labels as riyals", () => {
    expect(currencyMark("USD", "ar")).toBe("ر.س");
    expect(currencyMark("USD", "en")).toBe("SAR");
  });

  it("falls back to the ISO code for any other book", () => {
    expect(currencyMark("EUR", "ar")).toBe("EUR");
  });

  it("annotates the figure with its unit, keeping the figure Latin and tabular", () => {
    expect(formatMoney(1234.5, "SAR", "ar")).toBe("1,234.50 ر.س");
    expect(formatMoney(1234.5, "SAR", "en")).toBe("1,234.50 SAR");
  });

  it("shortens the seeded Meta Ads label", () => {
    expect(displayPlatformName("Meta Ads (Facebook & Instagram)")).toBe("Meta Ads");
    expect(displayPlatformName("Google Ads")).toBe("Google Ads");
  });
});
