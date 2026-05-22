"use client";

import { ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Reprompt {
  prompt: string;
  filesChanged: number;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  createdAt: Date | string;
}

interface BuildItemProps {
  prompt: string;
  framework: string;
  filesGenerated: number;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  createdAt: Date | string;
  deploymentUrl?: string;
  reprompts: Reprompt[];
}

function fmt(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function BuildItem({
  prompt,
  framework,
  filesGenerated,
  inputTokens,
  outputTokens,
  durationMs,
  createdAt,
  deploymentUrl,
  reprompts,
}: BuildItemProps) {
  const [open, setOpen] = useState(false);
  const tokens = inputTokens + outputTokens;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-border-mid transition-colors">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
      >
        <span className="size-1.75 rounded-full bg-success-l shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-foreground truncate">
            {prompt}
          </p>
          <p className="font-mono text-[11px] text-fg-subtle mt-0.5">
            {fmtDate(createdAt)} · {framework} · {fmt(durationMs)} ·{" "}
            {tokens.toLocaleString()} tokens
          </p>
        </div>
        <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface border border-border-mid text-muted-foreground whitespace-nowrap">
          {framework}
        </span>
        <span className="font-mono text-[11px] text-fg-subtle w-14 text-right">
          {filesGenerated} files
        </span>
        <ChevronRight
          className={cn(
            "size-4 text-fg-subtle transition-transform shrink-0",
            open && "rotate-90",
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-surface">
          {deploymentUrl && (
            <div className="flex items-center gap-3 px-4 pl-9 py-2.5 border-b border-border">
              <span className="size-1.5 rounded-full bg-success-l shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-fg-subtle font-mono">
                  Live deployment
                </p>
                <Link
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[12px] text-brand hover:underline truncate block"
                >
                  {deploymentUrl}
                </Link>
              </div>
              <Link
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-fg-subtle hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          )}

          {reprompts.map((r, i) => (
            <div
              key={r.prompt + String(i)}
              className="flex items-start gap-3 px-4 pl-9 py-2.5 border-b border-border last:border-none"
            >
              <span className="font-mono text-[11px] text-fg-subtle mt-0.5 shrink-0">
                ›
              </span>
              <div>
                <p className="text-[12px] text-muted-foreground">{r.prompt}</p>
                <p className="font-mono text-[10px] text-fg-subtle mt-0.5">
                  {fmtDate(r.createdAt)} · {r.filesChanged} files ·{" "}
                  {(r.inputTokens + r.outputTokens).toLocaleString()} tokens ·{" "}
                  {fmt(r.durationMs)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
