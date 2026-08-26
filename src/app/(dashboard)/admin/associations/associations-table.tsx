"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import { toggleAssociationActive } from "./actions";
import type { Association } from "@/types/domain";

export function AssociationsTable({ associations }: { associations: Association[] }) {
  const { dict } = useI18n();
  const [isPending, startTransition] = useTransition();

  if (associations.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.associations.name}</TableHead>
          <TableHead>{dict.associations.code}</TableHead>
          <TableHead>{dict.associations.status}</TableHead>
          <TableHead>{dict.common.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {associations.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="font-medium">{a.name}</TableCell>
            <TableCell>{a.code ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={a.is_active ? "success" : "muted"}>
                {a.is_active ? dict.common.active : dict.common.inactive}
              </Badge>
            </TableCell>
            <TableCell className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/associations/${a.id}/edit`}>{dict.common.edit}</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await toggleAssociationActive(a.id, !a.is_active);
                    toast.success(dict.common.savedSuccessfully);
                  })
                }
              >
                {a.is_active ? dict.common.inactive : dict.common.active}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
