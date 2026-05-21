"use client";

import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCliAuth } from "@/hooks/useCliAuth";
import type { UserInfo } from "@/lib/auth";
import { InvalidRequestCard } from "./invalid-request-card";
import { PermissionList } from "./permission-list";
import { UserInfoBadge } from "./user-info-badge";

export function CliAuthCard({ user: initialUser }: { user: UserInfo }) {
  const { requestId, user, approving, error, approve, deny } =
    useCliAuth(initialUser);

  return (
    <div className="bg-card border border-border rounded-[14px] p-7 w-full max-w-[400px] shadow-xl shadow-black/20">
      {!requestId ? (
        <InvalidRequestCard />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-xl bg-brand/10 border border-brand/20">
              <Terminal className="size-5 text-brand-l" />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-[-0.02em]">
                CLI Access Request
              </h1>
              <p className="text-[12.5px] text-muted-foreground mt-1">
                <span className="font-mono text-foreground">zyra</span> is
                requesting access to your account
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          {user && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-widest">
                Signed in as
              </p>
              <UserInfoBadge
                name={user.name}
                email={user.email}
                plan={user.plan}
              />
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-widest">
              This will allow
            </p>
            <PermissionList />
          </div>

          {error && (
            <p className="text-[12px] text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <Button onClick={approve} disabled={approving} className="w-full">
              {approving ? "Approving…" : "Approve Access"}
            </Button>
            <Button
              variant="outline"
              onClick={deny}
              disabled={approving}
              className="w-full"
            >
              Deny
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            This request expires in{" "}
            <span className="font-mono">10 minutes</span>. Run{" "}
            <span className="font-mono text-brand-l">zyraa login</span> to get a
            new one.
          </p>
        </div>
      )}
    </div>
  );
}
