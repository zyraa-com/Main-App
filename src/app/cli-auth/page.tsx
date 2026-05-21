import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CliAuthCard } from "@/components/cli-auth/cli-auth-card";
import { DashboardLogo } from "@/components/dashboard/dashboard-logo";
import { getCurrentUser } from "@/lib/auth";
import { AUTH_SERVICE_URL } from "@/lib/env";

function LoadingFallback() {
  return (
    <div className="bg-card border border-border rounded-[14px] p-7 w-full max-w-[400px]">
      <div className="flex flex-col gap-3 animate-pulse">
        <div className="h-12 w-12 bg-border rounded-xl mx-auto" />
        <div className="h-5 bg-border rounded mx-auto w-40" />
        <div className="h-9 bg-border rounded-[8px]" />
        <div className="h-20 bg-border rounded-[8px]" />
        <div className="h-10 bg-border rounded-[8px]" />
      </div>
    </div>
  );
}

export default async function CliAuthPage() {
  const user = await getCurrentUser();
  if (!user) redirect(`${AUTH_SERVICE_URL}/login`);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 gap-8">
      <DashboardLogo size="lg" />
      <Suspense fallback={<LoadingFallback />}>
        <CliAuthCard user={user} />
      </Suspense>
    </div>
  );
}
