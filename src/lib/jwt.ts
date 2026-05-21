import { jwtVerify, SignJWT } from "jose";
import { APP_URL, JWT_SECRET } from "./env";
import { logger } from "./logger";

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  exp: number;
}

export interface ConfigPayload {
  userId: string;
  email: string;
  apiEndpoint: string;
  permissions: string[];
  exp: number;
}

const secret = () => new TextEncoder().encode(JWT_SECRET);

export async function generateJWT(userData: {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
}): Promise<string> {
  return new SignJWT({
    email: userData.email,
    name: userData.name,
    ...(userData.image ? { image: userData.image } : {}),
    emailVerified: userData.emailVerified,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userData.id)
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as JWTPayload;
  } catch (error) {
    logger.error("verifyJWT", "JWT verification failed", error);
    return null;
  }
}

export async function generateConfigToken(userData: {
  id: string;
  email: string;
}): Promise<string> {
  return new SignJWT({
    userId: userData.id,
    email: userData.email,
    apiEndpoint: APP_URL,
    permissions: ["build", "deploy", "logs"],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("365d")
    .sign(secret());
}
