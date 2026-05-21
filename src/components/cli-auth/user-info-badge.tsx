interface UserInfoBadgeProps {
  name: string;
  email: string;
  plan: string;
}

export function UserInfoBadge({ name, email, plan }: UserInfoBadgeProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 bg-background border border-border rounded-[8px] px-4 py-3">
      <div className="size-9 rounded-full bg-gradient-to-br from-[#2A1800] to-brand-d border border-border-mid flex items-center justify-center text-[11px] font-bold text-brand-l shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate">{name}</p>
        <p className="text-[11px] font-mono text-muted-foreground truncate">
          {email}
        </p>
      </div>
      <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand-l border border-brand/25 shrink-0">
        {plan.toUpperCase()}
      </span>
    </div>
  );
}
