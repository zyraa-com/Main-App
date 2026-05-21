import { axiosInstance } from "@/lib/axiosInstance";
import { createMutationFn, createQueryConfig } from "@/lib/query";
import type {
  ActivityEntry,
  BuildEntry,
  CreditsData,
  DashboardStats,
} from "@/lib/types";
import type { PasswordInput, ProfileInput } from "@/lib/validations";

export const queryKeys = {
  stats: ["dashboard", "stats"] as const,
  activity: ["dashboard", "activity"] as const,
  builds: ["dashboard", "builds"] as const,
  credits: ["dashboard", "credits"] as const,
  cliToken: ["config", "cli-token"] as const,
};

export const statsQuery = createQueryConfig<DashboardStats>(
  queryKeys.stats,
  () => axiosInstance.get("/dashboard/stats"),
);

export const activityQuery = createQueryConfig<ActivityEntry[]>(
  queryKeys.activity,
  () => axiosInstance.get("/dashboard/activity"),
);

export const buildsQuery = createQueryConfig<BuildEntry[]>(
  queryKeys.builds,
  () => axiosInstance.get("/dashboard/builds"),
);

export const creditsQuery = createQueryConfig<CreditsData>(
  queryKeys.credits,
  () => axiosInstance.get("/dashboard/credits"),
);

export const cliTokenQuery = createQueryConfig<{
  token: string;
  command: string;
}>(queryKeys.cliToken, () => axiosInstance.post("/config/generate"), {
  staleTime: Infinity,
  gcTime: Infinity,
});

export const updateProfileFn = createMutationFn<
  { message: string },
  ProfileInput
>((data) => axiosInstance.patch("/dashboard/profile", data));

export const updatePasswordFn = createMutationFn<
  { message: string },
  PasswordInput
>((data) => axiosInstance.post("/dashboard/password", data));
