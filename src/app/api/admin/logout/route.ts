import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, revokeSession, getAccessToken, logAuditAction } from "@/lib/auth";

// POST /api/admin/logout - Logout admin
export async function POST(request: NextRequest) {
  try {
    const token = getAccessToken();
    
    if (token) {
      // Revoke session in database
      await revokeSession(token);
    }

    // Clear cookies
    clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
