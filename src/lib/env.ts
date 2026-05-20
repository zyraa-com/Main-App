export const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? "http://localhost:3001";

export const HOME_URL =
  process.env.NEXT_PUBLIC_HOME_URL ?? "http://localhost:3000";

export const APP_URL = process.env.APP_URL ?? "http://localhost:3002";

export const CLI_BACKEND_URL =
  process.env.CLI_BACKEND_URL ?? "http://localhost:4000";

export const MONGODB_URI = process.env.MONGODB_URI ?? "";

export const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? "";

if (IS_PRODUCTION && !COOKIE_DOMAIN) {
  throw new Error("NEXT_PUBLIC_COOKIE_DOMAIN must be set in production");
}
