import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "@/i18n";
import ar from "@/i18n/dictionaries/ar";
import { UserForm } from "./user-form";
import type { Association, Profile } from "@/types/domain";

const action = vi.fn(async () => ({}));

const associations = [
  { id: "11111111-1111-4111-8111-111111111111", name: "جمعية سقيا الماء" },
] as unknown as Association[];

function renderForm(props: Partial<Parameters<typeof UserForm>[0]> = {}) {
  return render(
    <I18nProvider initialLocale="ar">
      <UserForm associations={associations} action={action} mode="create" {...props} />
    </I18nProvider>
  );
}

const profile = {
  id: "22222222-2222-4222-8222-222222222222",
  full_name: "محمد جراد",
  role: "admin",
  is_active: true,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
} as Profile;

describe("UserForm", () => {
  it("can open an admin account, which is assigned no associations", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByText(ar.users.associationsAssigned)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(new RegExp(`^${ar.users.role}`)), "admin");

    expect(screen.queryByText(ar.users.associationsAssigned)).not.toBeInTheDocument();
    expect(screen.getByText(ar.users.adminSeesEverything)).toBeInTheDocument();
  });

  it("demands credentials when creating and treats them as optional when editing", () => {
    const { unmount } = renderForm();
    expect(screen.getByLabelText(new RegExp(`^${ar.users.email}`))).toBeRequired();
    expect(screen.getByLabelText(new RegExp(`^${ar.users.password}`))).toBeRequired();
    unmount();

    renderForm({ mode: "edit", profile, email: "admin@example.com" });
    expect(screen.getByLabelText(new RegExp(`^${ar.users.email}`))).toHaveValue(
      "admin@example.com"
    );
    expect(screen.getByLabelText(new RegExp(`^${ar.users.newPassword}`))).not.toBeRequired();
    expect(screen.getByText(ar.users.blankKeeps)).toBeInTheDocument();
  });

  it("locks an admin out of demoting or disabling their own account", () => {
    renderForm({ mode: "edit", profile, email: "admin@example.com", editingSelf: true });

    expect(screen.getByLabelText(new RegExp(`^${ar.users.role}`))).toBeDisabled();
    expect(screen.getByLabelText(ar.common.active)).toBeDisabled();
    expect(screen.getByText(ar.users.selfRoleLocked)).toBeInTheDocument();
  });
});
