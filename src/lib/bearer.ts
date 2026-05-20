import { verifyJWT } from "./jwt";

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim() || null;
}

export async function verifyBearerToken(authHeader: string | null) {
  const token = extractBearerToken(authHeader);
  if (!token) return null;
  return verifyJWT(token);
}
