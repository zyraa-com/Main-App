"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfileFn } from "@/lib/api/dashboard";
import { extractErrorMessage } from "@/lib/query";
import { type ProfileInput, profileSchema } from "@/lib/validations";

interface UseProfileOptions {
  defaultFirstName?: string;
  defaultLastName?: string;
}

export function useProfile({
  defaultFirstName = "",
  defaultLastName = "",
}: UseProfileOptions = {}) {
  const [successMessage, setSuccessMessage] = useState("");
  const { mutateAsync } = useMutation({ mutationFn: updateProfileFn });

  const form = useForm<ProfileInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileSchema as any),
    defaultValues: { firstName: defaultFirstName, lastName: defaultLastName },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setSuccessMessage("");
    try {
      await mutateAsync(data);
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      form.setError("root", {
        message: extractErrorMessage(error, "Failed to update profile."),
      });
    }
  });

  return { form, onSubmit, successMessage };
}
