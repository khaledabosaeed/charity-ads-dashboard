import { describe, expect, it } from "vitest";
import { accountSchema, createUserSchema, updateUserSchema } from "./user";

describe("createUserSchema", () => {
  it("accepts an admin account", () => {
    const parsed = createUserSchema.safeParse({
      fullName: "محمد جراد",
      role: "admin",
      email: "admin@example.com",
      password: "correct-horse",
    });
    expect(parsed.success).toBe(true);
  });

  it("refuses a role that is not one of the two", () => {
    const parsed = createUserSchema.safeParse({
      fullName: "محمد جراد",
      role: "owner",
      email: "admin@example.com",
      password: "correct-horse",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("updateUserSchema", () => {
  it("reads a blank credential as 'leave it unchanged'", () => {
    const parsed = updateUserSchema.parse({
      fullName: "محمد جراد",
      role: "media_buyer",
      isActive: true,
      email: "",
      password: "",
    });
    expect(parsed.email).toBeUndefined();
    expect(parsed.password).toBeUndefined();
  });

  it("still holds a supplied password to the minimum length", () => {
    const parsed = updateUserSchema.safeParse({
      fullName: "محمد جراد",
      role: "media_buyer",
      password: "short",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("accountSchema", () => {
  it("requires the current password and at least one change", () => {
    expect(accountSchema.safeParse({ currentPassword: "", password: "long-enough" }).success).toBe(
      false
    );
    expect(accountSchema.safeParse({ currentPassword: "x" }).success).toBe(false);
    expect(
      accountSchema.safeParse({ currentPassword: "x", email: "new@example.com" }).success
    ).toBe(true);
  });
});
