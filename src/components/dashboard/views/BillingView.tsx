"use client";

import { PageHeader } from "@/components/dashboard/form/page-header";
import { Button } from "@/components/ui/button";
import type { UserInfo } from "@/lib/auth";

function PlanCard({ user }: { user: UserInfo | null }) {
  return (
    <div className="bg-card border border-border rounded-[10px] p-6 shadow-[0_0_32px_var(--brand-glow)] flex items-center justify-between mb-4">
      <div>
        <p className="font-mono text-[10px] font-semibold text-fg-subtle uppercase tracking-[0.08em] mb-2">
          {user?.plan ?? "Free"} Plan
        </p>
        <p className="text-[28px] font-extrabold tracking-[-0.03em] leading-none">
          {user?.isPremium ? "$20" : "$0"}{" "}
          <span className="text-[14px] font-normal text-muted-foreground">
            /mo
          </span>
        </p>
        <p className="text-[12px] text-fg-subtle mt-2">
          {user?.isPremium
            ? "Unlimited builds · 1M tokens"
            : `${user?.usage?.remainingTrial ?? 0} builds remaining · 100k tokens · resets monthly`}
        </p>
      </div>
      {!user?.isPremium && (
        <Button variant="brand" size="sm" disabled>
          Upgrade to Pro
        </Button>
      )}
    </div>
  );
}

function InvoiceList() {
  return (
    <>
      <div className="mb-3">
        <h2 className="text-[13px] font-semibold">Invoice History</h2>
      </div>
      <div className="bg-card border border-border rounded-[10px] p-8 text-center">
        <p className="text-[13px] text-muted-foreground">No invoices yet.</p>
        <p className="text-[12px] text-fg-subtle mt-1">
          Invoices appear here after upgrading to Pro.
        </p>
      </div>
    </>
  );
}

export function BillingView({ user }: { user: UserInfo | null }) {
  return (
    <div className="py-7 px-8 max-w-2xl">
      <PageHeader title="Billing" sub="Manage your plan and payment history." />
      <PlanCard user={user} />
      <InvoiceList />
    </div>
  );
}
