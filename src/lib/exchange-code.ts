import { redis } from "./redis";

const PREFIX = "exc:";

export async function consumeExchangeCode(
  code: string,
): Promise<string | null> {
  const userId = await redis.getdel(`${PREFIX}${code}`);
  if (!userId || typeof userId !== "string") return null;
  return userId;
}
