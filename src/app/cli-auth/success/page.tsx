import { SuccessCard } from "@/components/cli-auth/success-card";
import { DashboardLogo } from "@/components/dashboard/dashboard-logo";

export default function CliAuthSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 gap-8">
      <DashboardLogo size="lg" />
      <SuccessCard />
    </div>
  );
}
