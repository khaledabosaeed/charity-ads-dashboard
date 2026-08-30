"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { setAssociationMediaBuyers, setAssociationPlatforms } from "../../actions";
import type { Platform, Profile } from "@/types/domain";

function CheckboxGroup({
  items,
  selected,
  onToggle,
  labelOf,
}: {
  items: { id: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  labelOf: (item: { id: string }) => string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <label key={item.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-line"
            checked={selected.has(item.id)}
            onChange={() => onToggle(item.id)}
          />
          {labelOf(item)}
        </label>
      ))}
    </div>
  );
}

export function AssociationLinks({
  associationId,
  platforms,
  mediaBuyers,
  selectedPlatformIds,
  selectedMediaBuyerIds,
}: {
  associationId: string;
  platforms: Platform[];
  mediaBuyers: Profile[];
  selectedPlatformIds: string[];
  selectedMediaBuyerIds: string[];
}) {
  const { dict } = useI18n();
  const [platformSet, setPlatformSet] = useState(new Set(selectedPlatformIds));
  const [buyerSet, setBuyerSet] = useState(new Set(selectedMediaBuyerIds));
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="border border-line bg-paper-raised">
        <header className="border-b border-line px-4 py-2.5">
          <h2 className="annot">{dict.associations.platformsLinked}</h2>
        </header>
        <div className="flex flex-col gap-4 px-4 py-4">
          <CheckboxGroup
            items={platforms}
            selected={platformSet}
            labelOf={(item) => platforms.find((p) => p.id === item.id)?.name ?? ""}
            onToggle={(id) => {
              const next = new Set(platformSet);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              setPlatformSet(next);
            }}
          />
          <Button
            size="sm"
            className="w-fit"
            disabled={isPending} pending={isPending}
            onClick={() =>
              startTransition(async () => {
                await setAssociationPlatforms(associationId, Array.from(platformSet));
                toast.success(dict.common.savedSuccessfully);
              })
            }
          >
            {dict.common.save}
          </Button>
        </div>
      </section>

      <section className="border border-line bg-paper-raised">
        <header className="border-b border-line px-4 py-2.5">
          <h2 className="annot">{dict.associations.mediaBuyersLinked}</h2>
        </header>
        <div className="flex flex-col gap-4 px-4 py-4">
          <CheckboxGroup
            items={mediaBuyers}
            selected={buyerSet}
            labelOf={(item) => mediaBuyers.find((b) => b.id === item.id)?.full_name ?? ""}
            onToggle={(id) => {
              const next = new Set(buyerSet);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              setBuyerSet(next);
            }}
          />
          <Button
            size="sm"
            className="w-fit"
            disabled={isPending} pending={isPending}
            onClick={() =>
              startTransition(async () => {
                await setAssociationMediaBuyers(associationId, Array.from(buyerSet));
                toast.success(dict.common.savedSuccessfully);
              })
            }
          >
            {dict.common.save}
          </Button>
        </div>
      </section>
    </div>
  );
}
