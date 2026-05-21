import type { ReactNode } from "react";

interface FormCardProps {
  title: string;
  sub?: string;
  children: ReactNode;
  danger?: boolean;
  className?: string;
}

export function FormCard({
  title,
  sub,
  children,
  danger = false,
  className,
}: FormCardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-[10px] p-6 ${className ?? ""}`}
    >
      <h2
        className={`text-[13px] font-semibold mb-0.5 ${danger ? "text-destructive" : ""}`}
      >
        {title}
      </h2>
      {sub && <p className="text-[12px] text-muted-foreground mb-5">{sub}</p>}
      {children}
    </div>
  );
}
