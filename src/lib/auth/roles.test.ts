import { describe, expect, it } from "vitest";
import ar from "@/i18n/dictionaries/ar";
import { canReadAll, canWrite, isViewer, roleLabel } from "./roles";

describe("role predicates", () => {
  it("lets an admin and a viewer read the whole portfolio", () => {
    expect(canReadAll("admin")).toBe(true);
    expect(canReadAll("viewer")).toBe(true);
    expect(canReadAll("media_buyer")).toBe(false);
  });

  it("keeps every write away from a viewer", () => {
    expect(canWrite("viewer")).toBe(false);
    expect(isViewer("viewer")).toBe(true);
    expect(canWrite("admin")).toBe(true);
    expect(canWrite("media_buyer")).toBe(true);
  });

  it("names each role in the reader's language", () => {
    expect(roleLabel("viewer", ar)).toBe(ar.nav.roleViewer);
    expect(roleLabel("admin", ar)).toBe(ar.nav.roleAdmin);
    expect(roleLabel("media_buyer", ar)).toBe(ar.nav.roleMediaBuyer);
  });
});
