import { describe, expect, it } from "vitest";
import {
  avgDonationValue,
  formatMetric,
  remainingBudget,
  roas,
  spendPercentage,
} from "./statistics";

describe("remainingBudget", () => {
  it("subtracts spent from budget", () => {
    expect(remainingBudget(1000, 400)).toBe(600);
  });

  it("can go negative when overspent", () => {
    expect(remainingBudget(100, 150)).toBe(-50);
  });
});

describe("spendPercentage", () => {
  it("computes percentage spent", () => {
    expect(spendPercentage(1000, 250)).toBe(25);
  });

  it("returns 0 when budget is 0", () => {
    expect(spendPercentage(0, 100)).toBe(0);
  });

  it("returns 0 when budget is negative", () => {
    expect(spendPercentage(-10, 100)).toBe(0);
  });
});

describe("roas", () => {
  it("computes advertising return over spend", () => {
    expect(roas(500, 100)).toBe(5);
  });

  it("returns null when spend is 0", () => {
    expect(roas(500, 0)).toBeNull();
  });
});

describe("avgDonationValue", () => {
  it("computes average donation", () => {
    expect(avgDonationValue(1000, 4)).toBe(250);
  });

  it("returns null when donation count is 0", () => {
    expect(avgDonationValue(0, 0)).toBeNull();
  });
});

describe("formatMetric", () => {
  it("formats a present value", () => {
    expect(formatMetric(5, (n) => `${n}x`)).toBe("5x");
  });

  it("shows an em dash for null", () => {
    expect(formatMetric(null, (n) => `${n}x`)).toBe("—");
  });
});
