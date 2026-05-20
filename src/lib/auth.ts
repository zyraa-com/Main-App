import { cache } from "react";
import { cookies, headers } from "next/headers";
import { UserModel } from "@zyraalabs/zyraa-db";
import { verifyJWT } from "./jwt";
import { extractBearerToken } from "./bearer";
import { connectToDatabase } from "./db";
import { logger } from "./logger";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  isPremium: boolean;
  plan: string;
  trialUsed: boolean;
  usage: {
    totalBuilds: number;
    remainingTrial: number;
  };
}

export const getCurrentUser = cache(async (): Promise<UserInfo | null> => {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();

    const cookieToken = cookieStore.get("auth-token")?.value;
    const bearerToken = extractBearerToken(headerStore.get("authorization"));
    const token = cookieToken ?? bearerToken;

    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload) return null;

    await connectToDatabase();

    const dbUser = await UserModel.findById(payload.sub)
      .select("isPremium plan trialUsed usage")
      .lean();

    if (!dbUser) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.image,
      emailVerified: payload.emailVerified,
      isPremium: dbUser.isPremium,
      plan: dbUser.plan,
      trialUsed: dbUser.trialUsed,
      usage: dbUser.usage,
    };
  } catch (error) {
    logger.error("auth-utils", "Failed to get current user", error);
    return null;
  }
});

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
