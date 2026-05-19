import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";
import { GenerationModel as Generation } from "@zyraalabs/zyraa-db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.warn("dashboard-stats", "Unauthorized access attempt");
      return ErrorResponse("Unauthorized", 401);
    }

    await connectToDatabase();

    const [agg] = await Generation.aggregate([
      { $match: { userId: user.id } },
      {
        $group: {
          _id: null,
          totalBuilds: { $sum: 1 },
          totalFiles: { $sum: "$filesGenerated" },
          totalTokens: { $sum: { $add: ["$inputTokens", "$outputTokens"] } },
          totalDurationMs: { $sum: "$durationMs" },
        },
      },
    ]);

    logger.info("dashboard-stats", `Stats fetched for user: ${user.email}`);

    return SuccessResponse({
      totalBuilds: agg?.totalBuilds ?? 0,
      totalFiles: agg?.totalFiles ?? 0,
      totalTokens: agg?.totalTokens ?? 0,
      avgDurationSec: agg
        ? Math.round(agg.totalDurationMs / agg.totalBuilds / 100) / 10
        : 0,
      remainingTrial: user.usage.remainingTrial,
      plan: user.plan,
      isPremium: user.isPremium,
    });
  } catch (error) {
    logger.error("dashboard-stats", "Failed to fetch stats", error);
    return ErrorResponse("Failed to fetch stats", 500);
  }
}
