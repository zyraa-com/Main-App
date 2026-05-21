import type { UserInfo } from "@/lib/auth";
import { NavItem } from "./nav-item";
import { UserMenu } from "./user-menu";

const MAIN_NAV = [
  { href: "/dashboard", icon: "▸", label: "Overview" },
  { href: "/dashboard/builds", icon: "≋", label: "Builds" },
  { href: "/dashboard/credits", icon: "◈", label: "Credits & Usage" },
];

const SETTINGS_NAV = [
  { href: "/dashboard/profile", icon: "◉", label: "Profile" },
  { href: "/dashboard/password", icon: "◆", label: "Password" },
  { href: "/dashboard/billing", icon: "❑", label: "Billing" },
  { href: "/dashboard/cli", icon: "❯", label: "CLI Config" },
];

interface SidebarProps {
  user: UserInfo;
}

export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-card border-r border-border overflow-y-auto">
      <div className="p-[10px]">
        <p className="font-mono text-[9px] font-semibold text-fg-subtle tracking-[0.1em] uppercase px-[10px] pt-[6px] pb-[4px]">
          Main
        </p>
        {MAIN_NAV.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>

      <div className="p-[10px]">
        <p className="font-mono text-[9px] font-semibold text-fg-subtle tracking-[0.1em] uppercase px-[10px] pt-[6px] pb-[4px]">
          Settings
        </p>
        {SETTINGS_NAV.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>

      <div className="mt-auto p-[10px] border-t border-border">
        <UserMenu
          name={user.name}
          email={user.email}
          image={user.image}
          variant="sidebar"
        />
      </div>
    </aside>
  );
}
