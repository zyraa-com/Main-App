import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function InvalidRequestCard() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-destructive/10 border border-destructive/20 mx-auto mb-5">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <h1 className="text-[18px] font-bold tracking-[-0.02em] mb-2">
        Invalid Request
      </h1>
      <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">
        This CLI authentication link is invalid or has already expired.
        <br />
        Run <code className="font-mono text-brand-l">zyraa login</code> again to
        get a new link.
      </p>
      <Button asChild className="w-full">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
