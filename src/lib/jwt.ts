import jwt from "jsonwebtoken";
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

export function generateJWT(userData: {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
}): string {
  const payload: JWTPayload = {
    sub: userData.id,
    email: userData.email,
    name: userData.name,
    image: userData.image,
    emailVerified: userData.emailVerified,
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  };
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    logger.error("verifyJWT", "JWT verification failed", error);
    return null;
  }
}

export interface ConfigPayload {
  userId: string;
  email: string;
  apiEndpoint: string;
  permissions: string[];
  exp: number;
}

export function generateConfigToken(userData: {
  id: string;
  email: string;
}): string {
  const payload: ConfigPayload = {
    userId: userData.id,
    email: userData.email,
    apiEndpoint: APP_URL,
    permissions: ["build", "deploy", "logs"],
    exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
  };
  return jwt.sign(payload, JWT_SECRET);
}
