import { UserModel as User } from "@zyraalabs/zyraa-db";
import bcrypt from "bcryptjs";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";
import { passwordSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.warn("dashboard-password", "Unauthorized access attempt");
      return ErrorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) {
      return ErrorResponse(
        parsed.error.issues[0]?.message ?? "Invalid input",
        400,
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    await connectToDatabase();
    const dbUser = await User.findById(user.id).select("+password");
    if (!dbUser?.password) {
      return ErrorResponse(
        "Password change is not available for OAuth accounts",
        400,
      );
    }

    const valid = await bcrypt.compare(currentPassword, dbUser.password);
    if (!valid) {
      return ErrorResponse("Current password is incorrect", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user.id, { password: hashed });

    logger.info(
      "dashboard-password",
      `Password updated for user: ${user.email}`,
    );
    return SuccessResponse({ message: "Password updated successfully" });
  } catch (error) {
    logger.error("dashboard-password", "Failed to update password", error);
    return ErrorResponse("Failed to update password", 500);
  }
}
