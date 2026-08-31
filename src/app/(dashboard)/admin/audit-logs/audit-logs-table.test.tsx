import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider } from "@/i18n";
import ar from "@/i18n/dictionaries/ar";
import { AuditLogsTable } from "./audit-logs-table";
import type { AuditLogWithActor } from "@/types/domain";

const log = (
  id: number,
  action: string,
  table_name: string
): AuditLogWithActor => ({
  id,
  actor_id: null,
  action,
  table_name,
  record_id: "11111111-1111-4111-8111-111111111111",
  old_data: null,
  new_data: null,
  created_at: "2026-08-31T09:00:00.000Z",
  actor: { full_name: "محمد جراد" },
});

function renderLogs(logs: AuditLogWithActor[]) {
  return render(
    <I18nProvider initialLocale="ar">
      <AuditLogsTable logs={logs} />
    </I18nProvider>
  );
}

describe("AuditLogsTable", () => {
  it("reads the trigger's SQL back in the reader's words", () => {
    renderLogs([
      log(1, "INSERT", "statistics_entries"),
      log(2, "UPDATE", "associations"),
      log(3, "DELETE", "profiles"),
    ]);

    expect(screen.getByText(ar.auditLogs.actions.INSERT)).toBeInTheDocument();
    expect(screen.getByText(ar.auditLogs.actions.UPDATE)).toBeInTheDocument();
    expect(screen.getByText(ar.auditLogs.actions.DELETE)).toBeInTheDocument();
    expect(screen.getByText(ar.auditLogs.tables.statistics_entries)).toBeInTheDocument();
    expect(screen.getByText(ar.auditLogs.tables.associations)).toBeInTheDocument();
    expect(screen.queryByText("statistics_entries")).not.toBeInTheDocument();
  });

  it("falls back to the raw identifier for anything not named yet", () => {
    renderLogs([log(4, "TRUNCATE", "campaign_notes")]);

    expect(screen.getByText("campaign_notes")).toBeInTheDocument();
    expect(screen.getByText("TRUNCATE")).toBeInTheDocument();
  });

  it("keeps the timestamp in Latin figures", () => {
    renderLogs([log(5, "INSERT", "statistics_entries")]);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
