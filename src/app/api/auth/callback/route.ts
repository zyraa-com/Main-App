import { type NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { logger } from "@/lib/logger";
import { AUTH_SERVICE_URL, COOKIE_DOMAIN, IS_PRODUCTION } from "@/lib/env";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      logger.warn("auth-callback", "No token provided");
      return NextResponse.redirect(new URL(`${AUTH_SERVICE_URL}/login`));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      logger.error("auth-callback", "Invalid or expired JWT");
      return NextResponse.redirect(new URL(`${AUTH_SERVICE_URL}/login`));
    }

    const redirectUrl = new URL("/dashboard", request.url);
    const response = NextResponse.redirect(redirectUrl);

    const cookieOpts = {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax" as const,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
    };

    response.cookies.set("auth-token", token, cookieOpts);

    logger.info("auth-callback", `Auth successful: ${payload.email}`);
    return response;
  } catch (error) {
    logger.error("auth-callback", "Callback failed", error);
    return NextResponse.redirect(new URL(`${AUTH_SERVICE_URL}/login`));
  }
}
