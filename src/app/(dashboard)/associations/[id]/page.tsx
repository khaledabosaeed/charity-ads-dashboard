import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeading } from "@/components/layout/page-heading";
import { AssociationDetail } from "./association-detail";
import type { StatisticsEntryWithRelations } from "@/types/domain";

export default async function AssociationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const [{ data: association }, { data: platforms }, { data: entries }, mediaBuyersResult] =
    await Promise.all([
      supabase.from("associations").select("*").eq("id", id).single(),
      supabase.from("association_platforms").select("platform:platforms(id, name)").eq("association_id", id),
      supabase
        .from("statistics_entries")
        .select("*, association:associations(id, name), platform:platforms(id, name), author:profiles(id, full_name)")
        .eq("association_id", id)
        .order("period_start", { ascending: false })
        .limit(20),
      profile?.role === "admin"
        ? supabase
            .from("association_media_buyers")
            .select("media_buyer:profiles(id, full_name)")
            .eq("association_id", id)
        : Promise.resolve({ data: null }),
    ]);

  if (!association) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="associations.title" />
      <AssociationDetail
        association={association}
        platforms={(
          (platforms ?? []) as unknown as { platform: { id: string; name: string } | null }[]
        )
          .map((p) => p.platform)
          .filter((p): p is { id: string; name: string } => Boolean(p))}
        mediaBuyers={(mediaBuyersResult.data ?? [])
          .map((m) => (m as unknown as { media_buyer: { id: string; full_name: string } | null }).media_buyer)
          .filter((m): m is { id: string; full_name: string } => Boolean(m))}
        entries={(entries as unknown as StatisticsEntryWithRelations[]) ?? []}
        isAdmin={profile?.role === "admin"}
      />
    </div>
  );
}
