import { describe, expect, it } from "vitest";
import { sanitizeDecimalInput, sanitizeIntegerInput } from "./numeric-input";

describe("sanitizeDecimalInput", () => {
  it("keeps a plain amount", () => {
    expect(sanitizeDecimalInput("1234.50")).toBe("1234.50");
  });

  it("drops letters, signs, and scientific notation", () => {
    expect(sanitizeDecimalInput("12e3")).toBe("123");
    expect(sanitizeDecimalInput("-40")).toBe("40");
    expect(sanitizeDecimalInput("+9.2")).toBe("9.2");
    expect(sanitizeDecimalInput("abc100xyz")).toBe("100");
  });

  it("keeps only the first decimal point", () => {
    expect(sanitizeDecimalInput("1.2.3")).toBe("1.23");
  });

  it("reads Arabic-Indic digits and the Arabic decimal separator", () => {
    expect(sanitizeDecimalInput("١٢٣٫٥")).toBe("123.5");
  });
});

describe("sanitizeIntegerInput", () => {
  it("keeps digits only", () => {
    expect(sanitizeIntegerInput("12.5e3")).toBe("1253");
    expect(sanitizeIntegerInput("٢٠")).toBe("20");
  });
});
