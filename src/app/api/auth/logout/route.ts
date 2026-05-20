import { type NextRequest, NextResponse } from "next/server";
import { AUTH_SERVICE_URL } from "@/lib/env";

export async function GET(_request: NextRequest) {
  return NextResponse.redirect(`${AUTH_SERVICE_URL}/api/auth/logout`);
}
