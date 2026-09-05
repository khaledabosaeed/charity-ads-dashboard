"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog";
import { deleteStatisticsEntry } from "./actions";

export function DeleteStatisticsButton({
  id,
  redirectTo,
}: {
  id: string;
  /** After a successful delete, leave this page (used on the edit sheet). */
  redirectTo?: string;
}) {
  const { dict } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <ConfirmDeleteDialog
      title={dict.common.confirmDeleteTitle}
      description={dict.statistics.confirmDeleteBody}
      disabled={isPending}
      trigger={
        <Button type="button" size="sm" variant="destructive" disabled={isPending} pending={isPending}>
          {dict.common.delete}
        </Button>
      }
      onConfirm={() =>
        startTransition(async () => {
          const result = await deleteStatisticsEntry(id);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          toast.success(dict.common.deletedSuccessfully);
          if (redirectTo) router.push(redirectTo);
        })
      }
    />
  );
}
