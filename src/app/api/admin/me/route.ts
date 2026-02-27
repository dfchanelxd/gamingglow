import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";

// GET /api/admin/me - Get current admin info
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: auth.user.id,
        email: auth.user.email,
        role: auth.user.role,
        tfaEnabled: auth.user.tfaEnabled,
        lastLogin: auth.user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
