import { UserModel } from "@zyraalabs/zyraa-db";
import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AUTH_SERVICE_URL, COOKIE_DOMAIN, IS_PRODUCTION } from "@/lib/env";
import { consumeExchangeCode } from "@/lib/exchange-code";
import { generateJWT } from "@/lib/jwt";
import { logger } from "@/lib/logger";

const cookieOpts = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
};

export async function GET(request: NextRequest) {
  const loginUrl = new URL(`${AUTH_SERVICE_URL}/login`);

  try {
    const code = new URL(request.url).searchParams.get("code");

    if (!code) {
      logger.warn("auth-callback", "No code provided");
      return NextResponse.redirect(loginUrl);
    }

    const userId = await consumeExchangeCode(code);

    if (!userId) {
      logger.warn("auth-callback", "Invalid or expired exchange code");
      return NextResponse.redirect(loginUrl);
    }

    await connectToDatabase();

    const user = await UserModel.findById(userId)
      .select("email name image emailVerified")
      .lean();

    if (!user) {
      logger.error("auth-callback", `User not found for id: ${userId}`);
      return NextResponse.redirect(loginUrl);
    }

    const token = await generateJWT({
      id: String(user._id),
      email: user.email,
      name: user.name ?? "",
      emailVerified: user.emailVerified,
    });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("auth-token", token, cookieOpts);

    logger.info("auth-callback", `Auth successful: ${user.email}`);
    return response;
  } catch (error) {
    logger.error("auth-callback", "Callback failed", error);
    return NextResponse.redirect(loginUrl);
  }
}
