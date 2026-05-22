export enum Provider {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials",
}

export enum Plan {
  FREE = "FREE",
  PRO = "PRO",
}

export interface DashboardStats {
  totalBuilds: number;
  totalFiles: number;
  totalTokens: number;
  avgDurationSec: number;
  remainingTrial: number;
  plan: string;
  isPremium: boolean;
}

export interface ActivityEntry {
  type: "build" | "reprompt";
  prompt: string;
  framework: string;
  files: number;
  tokens: number;
  durationMs: number;
  createdAt: string;
}

export interface RepromptEntry {
  prompt: string;
  filesChanged: number;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  createdAt: string;
}

export interface BuildEntry {
  _id: string;
  prompt: string;
  framework: string;
  filesGenerated: number;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  createdAt: string;
  deploymentUrl?: string;
  reprompts: RepromptEntry[];
}

export interface CreditsData {
  totalTokens: number;
  builds: Array<{
    _id: string;
    prompt: string;
    inputTokens: number;
    outputTokens: number;
  }>;
}
