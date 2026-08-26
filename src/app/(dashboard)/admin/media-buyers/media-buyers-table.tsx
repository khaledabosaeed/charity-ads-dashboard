"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import { toggleMediaBuyerActive } from "./actions";
import type { Profile } from "@/types/domain";

export function MediaBuyersTable({ mediaBuyers }: { mediaBuyers: Profile[] }) {
  const { dict } = useI18n();
  const [isPending, startTransition] = useTransition();

  if (mediaBuyers.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.mediaBuyers.fullName}</TableHead>
          <TableHead>{dict.mediaBuyers.status}</TableHead>
          <TableHead>{dict.common.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mediaBuyers.map((mb) => (
          <TableRow key={mb.id}>
            <TableCell className="font-medium">{mb.full_name}</TableCell>
            <TableCell>
              <Badge variant={mb.is_active ? "success" : "muted"}>
                {mb.is_active ? dict.common.active : dict.common.inactive}
              </Badge>
            </TableCell>
            <TableCell className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/media-buyers/${mb.id}/edit`}>{dict.common.edit}</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await toggleMediaBuyerActive(mb.id, !mb.is_active);
                    toast.success(dict.common.savedSuccessfully);
                  })
                }
              >
                {mb.is_active ? dict.common.inactive : dict.common.active}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
