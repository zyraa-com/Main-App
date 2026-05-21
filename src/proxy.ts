import arcjet, { detectBot, shield } from "@arcjet/next";
import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { extractBearerToken } from "@/lib/bearer";
import { AUTH_SERVICE_URL, JWT_SECRET } from "@/lib/env";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR"],
    }),
  ],
});

const PUBLIC_PREFIXES = [
  "/api/auth/callback",
  "/api/auth/logout",
  "/auth/",
  "/cli-auth",
  "/_next/",
  "/favicon.ico",
];

async function isValidToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const isLocalhost =
    request.nextUrl.hostname === "localhost" ||
    request.nextUrl.hostname === "127.0.0.1";
  if (!isLocalhost && process.env.NODE_ENV !== "development") {
    const decision = await aj.protect(request);
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { pathname } = request.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get("auth-token")?.value;
  const bearerToken = extractBearerToken(request.headers.get("authorization"));
  const token = cookieToken ?? bearerToken;

  if (!token || !(await isValidToken(token))) {
    const response = NextResponse.redirect(AUTH_SERVICE_URL);
    response.cookies.set("auth-token", "", { expires: new Date(0), path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
