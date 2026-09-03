"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect } from "@/components/ui/input";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";
import { RuledHeading } from "@/components/drawing";
import type { ActionState } from "../associations/actions";
import type { Association, Profile, UserRole } from "@/types/domain";

/**
 * One form for both accounts an admin can open: a media buyer, who is assigned
 * associations, and another admin, who is assigned none. Credentials sit in
 * their own ruled group — on an existing account a blank field there means the
 * credential is left exactly as it was.
 */
export function UserForm({
  profile,
  email,
  associations,
  selectedAssociationIds = [],
  action,
  mode,
  editingSelf = false,
}: {
  profile?: Profile;
  email?: string;
  associations: Association[];
  selectedAssociationIds?: string[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  mode: "create" | "edit";
  /** An admin may not demote or disable their own account. */
  editingSelf?: boolean;
}) {
  const { dict } = useI18n();
  const [state, formAction, isPending] = useActionState(action, {});
  const [role, setRole] = useState<UserRole>(profile?.role ?? "media_buyer");
  const [selected, setSelected] = useState(new Set(selectedAssociationIds));
  const creating = mode === "create";

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormItem>
          <FormLabel htmlFor="fullName" required>
            {dict.users.fullName}
          </FormLabel>
          <Input id="fullName" name="fullName" defaultValue={profile?.full_name} required />
          <FormError message={state.fieldErrors?.fullName} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="role" required>
            {dict.users.role}
          </FormLabel>
          <NativeSelect
            id="role"
            name="role"
            value={role}
            disabled={editingSelf}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="media_buyer">{dict.nav.roleMediaBuyer}</option>
            <option value="admin">{dict.nav.roleAdmin}</option>
          </NativeSelect>
          {/* A disabled select submits nothing, so the value still has to travel. */}
          {editingSelf ? <input type="hidden" name="role" value={role} /> : null}
          <FormError message={state.fieldErrors?.role} />
          {editingSelf ? <p className="annot">{dict.users.selfRoleLocked}</p> : null}
        </FormItem>

        {!creating ? (
          <FormItem>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={profile?.is_active ?? true}
                disabled={editingSelf}
              />
              {dict.common.active}
            </label>
            {editingSelf ? <input type="hidden" name="isActive" value="on" /> : null}
          </FormItem>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <RuledHeading>{dict.users.credentials}</RuledHeading>

        <FormItem>
          <FormLabel htmlFor="email" required={creating}>
            {dict.users.email}
          </FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="off"
            defaultValue={email}
            required={creating}
          />
          <FormError message={state.fieldErrors?.email} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="password" required={creating}>
            {creating ? dict.users.password : dict.users.newPassword}
          </FormLabel>
          <Input
            id="password"
            name="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            required={creating}
            minLength={8}
          />
          <FormError message={state.fieldErrors?.password} />
          {!creating ? <p className="annot">{dict.users.blankKeeps}</p> : null}
        </FormItem>
      </div>

      {role === "media_buyer" ? (
        <FormItem>
          <FormLabel>{dict.users.associationsAssigned}</FormLabel>
          <div className="flex flex-col gap-2.5 border border-line bg-paper-raised p-3">
            {associations.length === 0 ? (
              <span className="text-sm text-ink-3">{dict.common.noData}</span>
            ) : (
              associations.map((a) => (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    name="associationIds"
                    value={a.id}
                    checked={selected.has(a.id)}
                    onChange={() => {
                      const next = new Set(selected);
                      if (next.has(a.id)) next.delete(a.id);
                      else next.add(a.id);
                      setSelected(next);
                    }}
                  />
                  {a.name}
                </label>
              ))
            )}
          </div>
        </FormItem>
      ) : (
        <p className="annot">{dict.users.adminSeesEverything}</p>
      )}

      <FormError message={state.error} />
      <Button type="submit" disabled={isPending} pending={isPending} className="w-fit">
        {isPending ? dict.common.loading : dict.common.save}
      </Button>
    </form>
  );
}
