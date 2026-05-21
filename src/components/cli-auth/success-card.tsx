import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SuccessCard() {
  return (
    <div className="bg-card border border-border rounded-[14px] p-7 w-full max-w-[400px] shadow-xl shadow-black/20">
      <div className="flex flex-col items-center text-center gap-5">
        <div className="flex items-center justify-center size-14 rounded-2xl bg-success-l/10 border border-success-l/20">
          <CircleCheck className="size-7 text-success-l" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-[18px] font-bold tracking-[-0.02em]">
            Access Approved
          </h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            You can close this window and return to your terminal.
            <br />
            The <span className="font-mono text-foreground">zyraa</span> CLI is
            now authenticated.
          </p>
        </div>

        <div className="w-full bg-background border border-border-mid rounded-[8px] px-4 py-3 font-mono text-[12px] text-left">
          <span className="text-brand font-bold">$</span>{" "}
          <span className="text-muted-foreground">
            # Ready — run your first build
          </span>
          <br />
          <span className="text-brand font-bold">$</span>{" "}
          <span className="text-foreground">zyraa</span>
        </div>

        <Button asChild className="w-full">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
