"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updatePasswordFn } from "@/lib/api/dashboard";
import { extractErrorMessage } from "@/lib/query";
import { type PasswordInput, passwordSchema } from "@/lib/validations";

export function usePassword() {
  const [successMessage, setSuccessMessage] = useState("");
  const { mutateAsync } = useMutation({ mutationFn: updatePasswordFn });

  const form = useForm<PasswordInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(passwordSchema as any),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setSuccessMessage("");
    try {
      await mutateAsync(data);
      setSuccessMessage("Password updated successfully.");
      form.reset();
    } catch (error) {
      form.setError("root", {
        message: extractErrorMessage(error, "Failed to update password."),
      });
    }
  });

  return { form, onSubmit, successMessage };
}
