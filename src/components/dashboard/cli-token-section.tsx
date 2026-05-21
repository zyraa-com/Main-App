"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCliToken } from "@/hooks/dashboard/useCliToken";

function TokenBlock() {
  const { command, loading, error } = useCliToken();
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!command) return;
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-[8px] border border-border-mid bg-bg-input overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-mid">
        <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-[0.08em]">
          terminal
        </span>
        {command && (
          <Button
            variant="outline"
            size="xs"
            onClick={copy}
            className="h-5 px-2 text-[10px]"
          >
            <Copy className="size-2.5" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
      <div className="overflow-x-auto px-3 py-2.5">
        {loading ? (
          <p className="font-mono text-[12px] text-fg-subtle animate-pulse">
            Generating…
          </p>
        ) : error ? (
          <p className="font-mono text-[12px] text-destructive">{error}</p>
        ) : (
          <pre className="font-mono text-[12px] text-brand-l whitespace-pre select-all leading-relaxed">
            <span className="text-fg-subtle select-none">$ </span>
            {command}
          </pre>
        )}
      </div>
    </div>
  );
}

export function CliTokenSection() {
  return (
    <div className="bg-card border border-border rounded-[10px] p-6">
      <h2 className="text-[14px] font-semibold mb-1">Your Auth Command</h2>
      <p className="text-[12px] text-muted-foreground mb-5">
        Run this command in your terminal to link the CLI to your account.
      </p>
      <TokenBlock />
      <p className="text-[11px] text-fg-subtle mt-2.5">
        Expires in 30 min · select text above to copy manually
      </p>
    </div>
  );
}
