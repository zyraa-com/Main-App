"use client";

import { FormCard } from "@/components/dashboard/form/form-card";
import { FormField } from "@/components/dashboard/form/form-field";
import { FormMessage } from "@/components/dashboard/form/form-message";
import { PageHeader } from "@/components/dashboard/form/page-header";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/dashboard/useProfile";
import type { UserInfo } from "@/lib/auth";

function PersonalInfoForm({ user }: { user: UserInfo | null }) {
  const nameParts = (user?.name ?? "").split(" ");
  const defaultFirstName = nameParts[0] ?? "";
  const defaultLastName = nameParts.slice(1).join(" ");

  const { form, onSubmit, successMessage } = useProfile({
    defaultFirstName,
    defaultLastName,
  });
  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <FormCard
      title="Personal Information"
      sub="This is how you appear across Zyraa."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="First name"
            error={errors.firstName?.message}
            inputProps={{
              ...form.register("firstName"),
              type: "text",
              placeholder: "John",
              autoComplete: "given-name",
            }}
          />
          <FormField
            label="Last name"
            error={errors.lastName?.message}
            inputProps={{
              ...form.register("lastName"),
              type: "text",
              placeholder: "Doe",
              autoComplete: "family-name",
            }}
          />
        </div>
        <FormField
          label="Email"
          inputProps={{
            type: "email",
            defaultValue: user?.email ?? "",
            disabled: true,
            readOnly: true,
          }}
        />
        {errors.root?.message && <FormMessage message={errors.root.message} />}
        {successMessage && (
          <FormMessage message={successMessage} isError={false} />
        )}
        <Button type="submit" variant="brand" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </FormCard>
  );
}

function DangerZone() {
  return (
    <FormCard title="Danger Zone" danger>
      <p className="text-[12px] text-muted-foreground mb-4">
        Permanently delete your account and all build history. This cannot be
        undone.
      </p>
      <Button variant="destructive" size="sm">
        Delete my account
      </Button>
    </FormCard>
  );
}

export function ProfileView({ user }: { user: UserInfo | null }) {
  return (
    <div className="py-7 px-8 max-w-xl">
      <PageHeader title="Profile" sub="Update your personal information." />
      <div className="space-y-4">
        <PersonalInfoForm user={user} />
        <DangerZone />
      </div>
    </div>
  );
}
