import type { Database } from "@/types/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Association = Database["public"]["Tables"]["associations"]["Row"];
export type Platform = Database["public"]["Tables"]["platforms"]["Row"];
export type AssociationPlatform = Database["public"]["Tables"]["association_platforms"]["Row"];
export type AssociationMediaBuyer =
  Database["public"]["Tables"]["association_media_buyers"]["Row"];
export type StatisticsEntry = Database["public"]["Tables"]["statistics_entries"]["Row"];
export type StoreSalesEntry = Database["public"]["Tables"]["store_sales_entries"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type AuditLogWithActor = AuditLog & { actor: Pick<Profile, "full_name"> | null };

export type StatisticsEntryWithRelations = StatisticsEntry & {
  association: Pick<Association, "id" | "name"> | null;
  platform: Pick<Platform, "id" | "name"> | null;
  author: Pick<Profile, "id" | "full_name"> | null;
};
