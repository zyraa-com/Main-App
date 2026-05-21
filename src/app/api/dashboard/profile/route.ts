import { UserModel as User } from "@zyraalabs/zyraa-db";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";
import { profileSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.warn("dashboard-profile", "Unauthorized access attempt");
      return ErrorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return ErrorResponse(
        parsed.error.issues[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { firstName, lastName } = parsed.data;
    const name = [firstName, lastName].filter(Boolean).join(" ");

    await connectToDatabase();
    await User.findByIdAndUpdate(user.id, { name });

    logger.info("dashboard-profile", `Profile updated for user: ${user.email}`);
    return SuccessResponse({ message: "Profile updated successfully" });
  } catch (error) {
    logger.error("dashboard-profile", "Failed to update profile", error);
    return ErrorResponse("Failed to update profile", 500);
  }
}
