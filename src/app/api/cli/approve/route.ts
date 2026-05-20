import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { generateConfigToken } from "@/lib/jwt";
import { logger } from "@/lib/logger";
import { approveCliLogin } from "./api";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logger.warn("cli-approve", "Unauthorized access attempt");
      return ErrorResponse("Unauthorized", 401);
    }

    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      logger.warn("cli-approve", "No auth token found");
      return ErrorResponse("Unauthorized", 401);
    }

    const { requestId } = await req.json();

    if (!requestId) {
      logger.warn("cli-approve", "Missing request ID");
      return ErrorResponse("Request ID is required", 400);
    }

    const configToken = await generateConfigToken({
      id: user.id,
      email: user.email,
    });

    const result = await approveCliLogin(
      {
        requestId,
        userId: user.id,
        token: configToken,
      },
      authToken.value,
    );

    if (result.code === "error") {
      const errorMessage =
        result.error instanceof Error
          ? result.error.message
          : "Failed to approve CLI access";
      logger.error("cli-approve", "CLI backend request failed", result.error);
      return ErrorResponse(errorMessage, 500);
    }

    if (!result.data.success) {
      logger.warn("cli-approve", `Approval failed: ${result.data.error}`);
      return ErrorResponse(
        result.data.error || "Failed to approve CLI access",
        400,
      );
    }

    logger.info("cli-approve", `CLI access approved for user: ${user.email}`);
    return SuccessResponse({ message: "CLI access approved successfully" });
  } catch (error) {
    logger.error("cli-approve", "Unexpected error in CLI approve", error);
    return ErrorResponse("Internal server error", 500);
  }
}
