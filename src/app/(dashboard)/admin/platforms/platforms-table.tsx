"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import { togglePlatformActive } from "./actions";
import type { Platform } from "@/types/domain";

export function PlatformsTable({ platforms }: { platforms: Platform[] }) {
  const { dict } = useI18n();
  const [isPending, startTransition] = useTransition();

  if (platforms.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.platforms.name}</TableHead>
          <TableHead>{dict.platforms.slug}</TableHead>
          <TableHead>{dict.associations.status}</TableHead>
          <TableHead>{dict.common.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {platforms.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell className="font-mono text-xs">{p.slug}</TableCell>
            <TableCell>
              <Badge variant={p.is_active ? "success" : "muted"}>
                {p.is_active ? dict.common.active : dict.common.inactive}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await togglePlatformActive(p.id, !p.is_active);
                    toast.success(dict.common.savedSuccessfully);
                  })
                }
              >
                {p.is_active ? dict.common.inactive : dict.common.active}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
