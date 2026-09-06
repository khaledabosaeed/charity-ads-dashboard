import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import ar from "@/i18n/dictionaries/ar";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/entry" }));

function renderRail(props: React.ComponentProps<typeof Sidebar>) {
  return render(
    <I18nProvider initialLocale="ar">
      <Sidebar {...props} />
    </I18nProvider>
  );
}

describe("Sidebar", () => {
  it("gives a media buyer their four sheets and nothing administrative", () => {
    renderRail({ role: "media_buyer" });

    expect(screen.getByRole("link", { name: ar.nav.dailyEntry })).toHaveAttribute("href", "/entry");
    expect(screen.getByRole("link", { name: ar.nav.dailyReport })).toHaveAttribute("href", "/daily");
    expect(screen.getByRole("link", { name: ar.nav.platformsSummary })).toHaveAttribute(
      "href",
      "/platforms"
    );
    expect(screen.getByRole("link", { name: ar.nav.associationsPerformance })).toHaveAttribute(
      "href",
      "/associations"
    );
    expect(screen.queryByRole("link", { name: ar.nav.auditLogs })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: ar.nav.users })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: ar.nav.dailyEntry })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("keeps the admin's own rail, users sheet included", () => {
    renderRail({ role: "admin" });
    expect(screen.getByRole("link", { name: ar.nav.auditLogs })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: ar.nav.dashboard })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: ar.nav.users })).toHaveAttribute(
      "href",
      "/admin/users"
    );
  });

  it("gives a viewer the three reading sheets and no way to write", () => {
    renderRail({ role: "viewer" });

    expect(screen.getByRole("link", { name: ar.nav.dashboard })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: ar.nav.dailyReport })).toHaveAttribute("href", "/daily");
    expect(screen.getByRole("link", { name: ar.nav.statistics })).toHaveAttribute(
      "href",
      "/statistics"
    );
    expect(screen.queryByRole("link", { name: ar.nav.dailyEntry })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: ar.nav.users })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: ar.nav.auditLogs })).not.toBeInTheDocument();
  });

  it("closed, keeps every destination reachable and named", () => {
    renderRail({ role: "media_buyer", collapsed: true });

    const link = screen.getByRole("link", { name: ar.nav.dailyReport });
    expect(link).toHaveAttribute("title", ar.nav.dailyReport);
    expect(link).toHaveAttribute("href", "/daily");
  });
});
