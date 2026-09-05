import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "@/i18n";
import ar from "@/i18n/dictionaries/ar";
import { DailyEntrySheet } from "./daily-entry-sheet";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("./actions", () => ({ saveDailySheet: vi.fn(async () => ({})) }));

const associations = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "جمعية سقيا الماء",
    platforms: [
      { id: "22222222-2222-4222-8222-222222222222", name: "سناب شات" },
      { id: "33333333-3333-4333-8333-333333333333", name: "تيك توك" },
    ],
  },
];

function renderSheet() {
  return render(
    <I18nProvider initialLocale="ar">
      <DailyEntrySheet
        associations={associations}
        mediaBuyers={[]}
        date="2026-08-31"
        associationId={associations[0].id}
        mediaBuyerId="44444444-4444-4444-8444-444444444444"
        buyerName="محمد جراد"
        lines={[]}
        currency="SAR"
      />
    </I18nProvider>
  );
}

describe("DailyEntrySheet", () => {
  it("draws the reference band, a line per platform, and the day summary", () => {
    renderSheet();

    expect(screen.getByRole("heading", { name: ar.daily.entryTitle })).toBeInTheDocument();
    expect(screen.getByText(`${ar.daily.greeting} محمد جراد`)).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(`^${ar.daily.date}`))).toHaveValue("2026-08-31");
    expect(screen.getByText(ar.daily.mediaBuyer)).toBeInTheDocument();

    for (const platform of associations[0].platforms) {
      expect(screen.getByRole("heading", { name: platform.name })).toBeInTheDocument();
    }
    expect(screen.getAllByLabelText(ar.statistics.amountSpent)).toHaveLength(2);
    expect(screen.getAllByLabelText(ar.statistics.advertisingReturn)).toHaveLength(2);
    expect(screen.getByText(ar.daily.daySummary)).toBeInTheDocument();
    /* the unit is read in the sheet's own script */
    expect(screen.getAllByText("ر.س").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: new RegExp(ar.daily.saveDay) })).toBeInTheDocument();
  });

  it("reads the day back as it is typed", async () => {
    const user = userEvent.setup();
    renderSheet();

    await user.type(screen.getAllByLabelText(ar.statistics.amountSpent)[0], "100");
    await user.type(screen.getAllByLabelText(ar.statistics.advertisingReturn)[0], "250");
    await user.type(screen.getByLabelText(ar.statistics.associationReturn), "150");

    /* the platform line still reads advertising return; the day's ROAS reads association return */
    expect(screen.getByText("2.50×")).toBeInTheDocument();
    expect(screen.getByText("1.50×")).toBeInTheDocument();
    expect(screen.getByText(`1 / 2`)).toBeInTheDocument();
  });

  it("files the day under the buyer and association the sheet was drawn from", () => {
    const { container } = renderSheet();
    const hidden = (name: string) =>
      container.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`)?.value;

    expect(hidden("associationId")).toBe(associations[0].id);
    expect(hidden("mediaBuyerId")).toBe("44444444-4444-4444-8444-444444444444");
    expect(hidden("currencyCode")).toBe("SAR");
    expect(
      container.querySelector(`input[name="spend:${associations[0].platforms[0].id}"]`)
    ).toBeInTheDocument();
  });
});
