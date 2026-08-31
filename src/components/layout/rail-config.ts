/** Server-safe rail constants. See src/i18n/config.ts for why these are split out. */
export type RailState = "open" | "closed";

export const RAIL_COOKIE_NAME = "rail";

export const DEFAULT_RAIL: RailState = "open";
