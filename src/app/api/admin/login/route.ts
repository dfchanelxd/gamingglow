import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  createSession,
  setAuthCookies,
  generateTOTPSecret,
  generateTOTPQRCode,
  verifyTOTP,
  logAuditAction,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/redis";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
  captchaToken: z.string().optional(),
});

const verify2FASchema = z.object({
  email: z.string().email(),
  token: z.string().length(6, "Kode 2FA harus 6 digit"),
});

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || "unknown";
    const rateLimit = await checkRateLimit(`login:${ip}`, 5, 300); // 5 attempts per 5 minutes
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan login. Silakan coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find admin
    const adminResult = await query(
      "SELECT id, email, password_hash, role, tfa_enabled, tfa_secret, disabled FROM admins WHERE email = $1",
      [email.toLowerCase()]
    );

    if (adminResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const admin = adminResult.rows[0];

    if (admin.disabled) {
      return NextResponse.json(
        { success: false, error: "Akun telah dinonaktifkan" },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, admin.password_hash);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // If 2FA is enabled, require token
    if (admin.tfa_enabled) {
      return NextResponse.json({
        success: true,
        requires2FA: true,
        email: admin.email,
        message: "Masukkan kode 2FA dari aplikasi authenticator",
      });
    }

    // Generate tokens
    const payload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Create session
    await createSession(
      admin.id,
      accessToken,
      refreshToken,
      request.ip || "unknown",
      request.headers.get("user-agent") || "unknown"
    );

    // Update last login
    await query("UPDATE admins SET last_login = NOW() WHERE id = $1", [admin.id]);

    // Log audit
    await logAuditAction(
      admin.id,
      "ADMIN_LOGIN",
      "admin",
      admin.id,
      { method: "password" },
      request.ip || undefined,
      request.headers.get("user-agent") || undefined
    );

    // Set cookies
    setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        tfaEnabled: admin.tfa_enabled,
      },
      message: "Login berhasil",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST /api/admin/login/verify-2fa - Verify 2FA token
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = verify2FASchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Kode 2FA tidak valid" },
        { status: 400 }
      );
    }

    const { email, token } = result.data;

    // Find admin
    const adminResult = await query(
      "SELECT id, email, password_hash, role, tfa_enabled, tfa_secret FROM admins WHERE email = $1",
      [email.toLowerCase()]
    );

    if (adminResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid" },
        { status: 401 }
      );
    }

    const admin = adminResult.rows[0];

    if (!admin.tfa_enabled || !admin.tfa_secret) {
      return NextResponse.json(
        { success: false, error: "2FA tidak diaktifkan" },
        { status: 400 }
      );
    }

    // Verify TOTP
    const valid = verifyTOTP(token, admin.tfa_secret);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Kode 2FA salah atau kadaluarsa" },
        { status: 401 }
      );
    }

    // Generate tokens
    const payload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Create session
    await createSession(
      admin.id,
      accessToken,
      refreshToken,
      request.ip || "unknown",
      request.headers.get("user-agent") || "unknown"
    );

    // Update last login
    await query("UPDATE admins SET last_login = NOW() WHERE id = $1", [admin.id]);

    // Log audit
    await logAuditAction(
      admin.id,
      "ADMIN_LOGIN",
      "admin",
      admin.id,
      { method: "2fa" },
      request.ip || undefined,
      request.headers.get("user-agent") || undefined
    );

    // Set cookies
    setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        tfaEnabled: admin.tfa_enabled,
      },
      message: "Login berhasil",
    });
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
