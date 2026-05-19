import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";
import { GenerationModel as Generation } from "@zyraalabs/zyraa-db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.warn("dashboard-credits", "Unauthorized access attempt");
      return ErrorResponse("Unauthorized", 401);
    }

    await connectToDatabase();

    const builds = await Generation.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("prompt inputTokens outputTokens")
      .lean();

    const totalTokens = builds.reduce(
      (sum, g) => sum + (g.inputTokens ?? 0) + (g.outputTokens ?? 0),
      0,
    );

    logger.info("dashboard-credits", `Credits fetched for user: ${user.email}`);

    return SuccessResponse({
      totalTokens,
      builds: builds.map((b) => ({
        _id: String(b._id),
        prompt: b.prompt,
        inputTokens: b.inputTokens ?? 0,
        outputTokens: b.outputTokens ?? 0,
      })),
    });
  } catch (error) {
    logger.error("dashboard-credits", "Failed to fetch credits", error);
    return ErrorResponse("Failed to fetch credits", 500);
  }
}
