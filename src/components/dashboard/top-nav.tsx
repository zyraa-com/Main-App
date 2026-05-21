import { DashboardLogo } from "@/components/dashboard/dashboard-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import type { UserInfo } from "@/lib/auth";

interface TopNavProps {
  user: UserInfo;
}

export function TopNav({ user }: TopNavProps) {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-card border-b border-border z-10">
      <DashboardLogo />

      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-[rgba(217,114,24,0.25)] bg-[--brand-dim] text-brand-l">
          {user.plan}
        </span>
        {!user.isPremium && (
          <Button variant="brand" size="sm" disabled>
            Upgrade to Pro
          </Button>
        )}
        <ThemeToggle />
        <UserMenu name={user.name} email={user.email} image={user.image} />
      </div>
    </header>
  );
}
