"use client";

import { FormCard } from "@/components/dashboard/form/form-card";
import { FormField } from "@/components/dashboard/form/form-field";
import { FormMessage } from "@/components/dashboard/form/form-message";
import { PageHeader } from "@/components/dashboard/form/page-header";
import { Button } from "@/components/ui/button";
import { usePassword } from "@/hooks/dashboard/usePassword";

function PasswordForm() {
  const { form, onSubmit, successMessage } = usePassword();
  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <FormCard title="Change Password" sub="Must be at least 8 characters.">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Current password"
          error={errors.currentPassword?.message}
          inputProps={{
            ...form.register("currentPassword"),
            type: "password",
            placeholder: "••••••••",
            autoComplete: "current-password",
          }}
        />
        <FormField
          label="New password"
          error={errors.newPassword?.message}
          inputProps={{
            ...form.register("newPassword"),
            type: "password",
            placeholder: "Minimum 8 characters",
            autoComplete: "new-password",
          }}
        />
        <FormField
          label="Confirm new password"
          error={errors.confirmPassword?.message}
          inputProps={{
            ...form.register("confirmPassword"),
            type: "password",
            placeholder: "Repeat new password",
            autoComplete: "new-password",
          }}
        />
        {errors.root?.message && <FormMessage message={errors.root.message} />}
        {successMessage && (
          <FormMessage message={successMessage} isError={false} />
        )}
        <Button type="submit" variant="brand" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </FormCard>
  );
}

export function PasswordView() {
  return (
    <div className="py-7 px-8 max-w-xl">
      <PageHeader title="Password" sub="Change your account password." />
      <PasswordForm />
    </div>
  );
}
