"use client";

import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import type { AuditLogWithActor } from "@/types/domain";

function badgeVariant(action: string) {
  if (action === "INSERT") return "success" as const;
  if (action === "DELETE") return "destructive" as const;
  return "default" as const;
}

export function AuditLogsTable({ logs }: { logs: AuditLogWithActor[] }) {
  const { dict, locale } = useI18n();

  if (logs.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead pinned>{dict.auditLogs.date}</TableHead>
          <TableHead>{dict.auditLogs.actor}</TableHead>
          <TableHead>{dict.auditLogs.action}</TableHead>
          <TableHead>{dict.auditLogs.table}</TableHead>
          <TableHead>{dict.auditLogs.record}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell pinned className="whitespace-nowrap figure text-[0.6875rem] text-ink-2">
              {new Date(log.created_at).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
            </TableCell>
            <TableCell>{log.actor?.full_name ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={badgeVariant(log.action)}>{log.action}</Badge>
            </TableCell>
            <TableCell className="figure text-[0.6875rem] text-ink-2">{log.table_name}</TableCell>
            <TableCell className="figure text-[0.6875rem] text-ink-2">{log.record_id ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
