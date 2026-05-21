import {
  GenerationModel as Generation,
  type IReprompt,
} from "@zyraalabs/zyraa-db";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.warn("dashboard-builds", "Unauthorized access attempt");
      return ErrorResponse("Unauthorized", 401);
    }

    await connectToDatabase();

    const builds = await Generation.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select(
        "prompt framework filesGenerated inputTokens outputTokens durationMs createdAt reprompts",
      )
      .lean();

    logger.info("dashboard-builds", `Builds fetched for user: ${user.email}`);

    return SuccessResponse(
      builds.map((b) => ({
        _id: String(b._id),
        prompt: b.prompt,
        framework: b.framework,
        filesGenerated: b.filesGenerated,
        inputTokens: b.inputTokens ?? 0,
        outputTokens: b.outputTokens ?? 0,
        durationMs: b.durationMs,
        createdAt: b.createdAt.toISOString(),
        reprompts: (b.reprompts ?? []).map((r: IReprompt) => ({
          prompt: r.prompt,
          filesChanged: r.filesChanged,
          inputTokens: r.inputTokens ?? 0,
          outputTokens: r.outputTokens ?? 0,
          durationMs: r.durationMs,
          createdAt: r.createdAt.toISOString(),
        })),
      })),
    );
  } catch (error) {
    logger.error("dashboard-builds", "Failed to fetch builds", error);
    return ErrorResponse("Failed to fetch builds", 500);
  }
}
