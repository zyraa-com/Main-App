"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { UserInfo } from "@/lib/auth";
import { axiosInstance } from "@/lib/axiosInstance";
import { requestHandler } from "@/lib/requesthandler";

interface ApprovePayload {
  requestId: string;
}

interface ApproveResponse {
  message: string;
}

interface UserSnapshot {
  name: string;
  email: string;
  plan: string;
}

const approveCliAccess = requestHandler((data?: ApprovePayload) =>
  axiosInstance.post<ApproveResponse>("/cli/approve", data),
);

export function useCliAuth(initialUser: UserInfo | null) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const requestId = searchParams.get("req");

  const [user] = useState<UserSnapshot | null>(
    initialUser
      ? {
          name: initialUser.name,
          email: initialUser.email,
          plan: initialUser.plan ?? "FREE",
        }
      : null,
  );
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = async () => {
    if (!requestId) return;
    setApproving(true);
    setError(null);

    const result = await approveCliAccess({ requestId });

    if (result.code === "error") {
      const msg =
        result.error instanceof Error
          ? result.error.message
          : "Failed to approve CLI access";
      setError(msg);
      setApproving(false);
      return;
    }

    router.push("/cli-auth/success");
  };

  const deny = () => router.push("/dashboard");

  return { requestId, user, loading: false, approving, error, approve, deny };
}
