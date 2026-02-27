import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import {
  authenticateRequest,
  generateTOTPSecret,
  generateTOTPQRCode,
  verifyTOTP,
  logAuditAction,
} from "@/lib/auth";

const setup2FASchema = z.object({
  action: z.enum(["setup", "verify", "disable"]),
  token: z.string().length(6).optional(),
});

// POST /api/admin/2fa - Setup or manage 2FA
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = setup2FASchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid" },
        { status: 400 }
      );
    }

    const { action, token } = result.data;

    switch (action) {
      case "setup": {
        // Generate new TOTP secret
        const secret = generateTOTPSecret();
        
        // Temporarily store secret (not enabled yet)
        await query(
          "UPDATE admins SET tfa_secret = $1 WHERE id = $2",
          [secret.base32, auth.user.id]
        );

        // Generate QR code
        const qrCodeUrl = await generateTOTPQRCode(secret);

        return NextResponse.json({
          success: true,
          secret: secret.base32,
          qrCode: qrCodeUrl,
          message: "Scan QR code dengan aplikasi authenticator Anda",
        });
      }

      case "verify": {
        if (!token) {
          return NextResponse.json(
            { success: false, error: "Token 2FA diperlukan" },
            { status: 400 }
          );
        }

        // Get stored secret
        const adminResult = await query(
          "SELECT tfa_secret FROM admins WHERE id = $1",
          [auth.user.id]
        );

        if (adminResult.rowCount === 0 || !adminResult.rows[0].tfa_secret) {
          return NextResponse.json(
            { success: false, error: "Setup 2FA tidak ditemukan" },
            { status: 400 }
          );
        }

        const secret = adminResult.rows[0].tfa_secret;

        // Verify token
        const valid = verifyTOTP(token, secret);

        if (!valid) {
          return NextResponse.json(
            { success: false, error: "Kode 2FA tidak valid" },
            { status: 401 }
          );
        }

        // Enable 2FA
        await query(
          "UPDATE admins SET tfa_enabled = TRUE WHERE id = $1",
          [auth.user.id]
        );

        // Log audit
        await logAuditAction(
          auth.user.id,
          "2FA_ENABLED",
          "admin",
          auth.user.id,
          {},
          request.ip || undefined,
          request.headers.get("user-agent") || undefined
        );

        return NextResponse.json({
          success: true,
          message: "2FA berhasil diaktifkan",
        });
      }

      case "disable": {
        if (!token) {
          return NextResponse.json(
            { success: false, error: "Token 2FA diperlukan untuk menonaktifkan" },
            { status: 400 }
          );
        }

        // Get stored secret
        const adminResult = await query(
          "SELECT tfa_secret FROM admins WHERE id = $1 AND tfa_enabled = TRUE",
          [auth.user.id]
        );

        if (adminResult.rowCount === 0 || !adminResult.rows[0].tfa_secret) {
          return NextResponse.json(
            { success: false, error: "2FA tidak aktif" },
            { status: 400 }
          );
        }

        const secret = adminResult.rows[0].tfa_secret;

        // Verify token
        const valid = verifyTOTP(token, secret);

        if (!valid) {
          return NextResponse.json(
            { success: false, error: "Kode 2FA tidak valid" },
            { status: 401 }
          );
        }

        // Disable 2FA
        await query(
          "UPDATE admins SET tfa_enabled = FALSE, tfa_secret = NULL WHERE id = $1",
          [auth.user.id]
        );

        // Log audit
        await logAuditAction(
          auth.user.id,
          "2FA_DISABLED",
          "admin",
          auth.user.id,
          {},
          request.ip || undefined,
          request.headers.get("user-agent") || undefined
        );

        return NextResponse.json({
          success: true,
          message: "2FA berhasil dinonaktifkan",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Aksi tidak valid" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("2FA error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// GET /api/admin/2fa/status - Check 2FA status
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await query(
      "SELECT tfa_enabled FROM admins WHERE id = $1",
      [auth.user.id]
    );

    return NextResponse.json({
      success: true,
      enabled: result.rows[0]?.tfa_enabled || false,
    });
  } catch (error) {
    console.error("2FA status error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
