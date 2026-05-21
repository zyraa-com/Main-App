import {
  GenerationModel as Generation,
  type IReprompt,
} from "@zyraalabs/zyraa-db";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { ActivityEntry } from "@/lib/types";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.warn("dashboard-activity", "Unauthorized access attempt");
      return ErrorResponse("Unauthorized", 401);
    }

    await connectToDatabase();

    const recent = await Generation.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        "prompt framework filesGenerated inputTokens outputTokens durationMs createdAt reprompts",
      )
      .lean();

    const activity: ActivityEntry[] = recent.flatMap((g) => {
      const main: ActivityEntry = {
        type: "build",
        prompt: g.prompt,
        framework: g.framework,
        files: g.filesGenerated,
        tokens: (g.inputTokens ?? 0) + (g.outputTokens ?? 0),
        durationMs: g.durationMs,
        createdAt: g.createdAt.toISOString(),
      };
      const reprompts: ActivityEntry[] = (g.reprompts ?? []).map(
        (r: IReprompt) => ({
          type: "reprompt",
          prompt: r.prompt,
          framework: g.framework,
          files: r.filesChanged,
          tokens: (r.inputTokens ?? 0) + (r.outputTokens ?? 0),
          durationMs: r.durationMs,
          createdAt: r.createdAt.toISOString(),
        }),
      );
      return [main, ...reprompts];
    });

    logger.info(
      "dashboard-activity",
      `Activity fetched for user: ${user.email}`,
    );

    return SuccessResponse(activity.slice(0, 10));
  } catch (error) {
    logger.error("dashboard-activity", "Failed to fetch activity", error);
    return ErrorResponse("Failed to fetch activity", 500);
  }
}
