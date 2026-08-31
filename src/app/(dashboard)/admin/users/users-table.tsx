"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import { toggleUserActive } from "./actions";
import type { Profile } from "@/types/domain";

export type UserRow = Profile & { email: string };

export function UsersTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const { dict } = useI18n();
  const [isPending, startTransition] = useTransition();

  if (users.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead pinned>{dict.users.fullName}</TableHead>
          <TableHead>{dict.users.email}</TableHead>
          <TableHead>{dict.users.role}</TableHead>
          <TableHead>{dict.users.status}</TableHead>
          <TableHead>{dict.common.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell pinned className="font-medium">
              {user.full_name}
              {user.id === currentUserId ? (
                <span className="annot ms-2">{dict.users.you}</span>
              ) : null}
            </TableCell>
            <TableCell className="figure text-ink-2">{user.email || "—"}</TableCell>
            <TableCell>
              <Badge variant={user.role === "admin" ? "default" : "muted"}>
                {user.role === "admin" ? dict.nav.roleAdmin : dict.nav.roleMediaBuyer}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.is_active ? "success" : "muted"}>
                {user.is_active ? dict.common.active : dict.common.inactive}
              </Badge>
            </TableCell>
            <TableCell className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/users/${user.id}/edit`}>{dict.common.edit}</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending || user.id === currentUserId}
                onClick={() =>
                  startTransition(async () => {
                    const result = await toggleUserActive(user.id, !user.is_active);
                    if (result?.error) toast.error(result.error);
                    else toast.success(dict.common.savedSuccessfully);
                  })
                }
              >
                {user.is_active ? dict.common.deactivate : dict.common.activate}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
