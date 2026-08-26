import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { AuditLogsTable } from "./audit-logs-table";
import type { AuditLogWithActor } from "@/types/domain";

export default async function AuditLogsPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*, actor:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="auditLogs.title" />
      <AuditLogsTable logs={(logs as unknown as AuditLogWithActor[]) ?? []} />
    </div>
  );
}
