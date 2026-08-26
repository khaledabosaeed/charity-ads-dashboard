import { createClient } from "@/lib/supabase/server";

export type AssociationOption = {
  id: string;
  name: string;
  platforms: { id: string; name: string }[];
};

/**
 * Associations the current user may create/edit statistics for, each with
 * its linked platforms. Relies entirely on RLS — an admin gets every active
 * association, a media buyer only the ones they are assigned to.
 */
export async function getAvailableAssociationsWithPlatforms(): Promise<AssociationOption[]> {
  const supabase = await createClient();

  const { data: associations } = await supabase
    .from("associations")
    .select("id, name, association_platforms(platform:platforms(id, name))")
    .eq("is_active", true)
    .order("name");

  return (associations ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    platforms: (
      (a as unknown as {
        association_platforms: { platform: { id: string; name: string } | null }[];
      }).association_platforms ?? []
    )
      .map((ap) => ap.platform)
      .filter((p): p is { id: string; name: string } => Boolean(p)),
  }));
}
