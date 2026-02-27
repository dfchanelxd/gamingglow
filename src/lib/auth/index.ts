import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { User } from "@/types";

// ============================================
// Password Hashing
// ============================================

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============================================
// JWT Tokens
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-min-32-chars!";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key!";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "15m";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return (jwt as any).sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function generateRefreshToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return (jwt as any).sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
}

export function verifyAccessToken(token: string): JWTPayload {
  return (jwt as any).verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return (jwt as any).verify(token, JWT_REFRESH_SECRET) as JWTPayload;
}

// ============================================
// 2FA (TOTP)
// ============================================

export function generateTOTPSecret(): speakeasy.GeneratedSecret {
  return speakeasy.generateSecret({
    name: process.env.TOTP_ISSUER || "GAMINGGLOW",
    length: 32,
  });
}

export async function generateTOTPQRCode(secret: speakeasy.GeneratedSecret): Promise<string> {
  return QRCode.toDataURL(secret.otpauth_url || "");
}

export function verifyTOTP(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 2, // Allow 2 time steps before/after
  });
}

// ============================================
// Session Management
// ============================================

export async function createSession(
  adminId: string,
  token: string,
  refreshToken: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await query(
    `INSERT INTO admin_sessions (admin_id, token, refresh_token, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [adminId, token, refreshToken, expiresAt, ipAddress, userAgent]
  );
}

export async function revokeSession(token: string): Promise<void> {
  await query("DELETE FROM admin_sessions WHERE token = $1", [token]);
}

export async function revokeAllUserSessions(adminId: string): Promise<void> {
  await query("DELETE FROM admin_sessions WHERE admin_id = $1", [adminId]);
}

export async function isSessionValid(token: string): Promise<boolean> {
  const result = await query(
    "SELECT 1 FROM admin_sessions WHERE token = $1 AND expires_at > NOW()",
    [token]
  );
  return (result.rowCount || 0) > 0;
}

// ============================================
// Cookie Management
// ============================================

const ACCESS_TOKEN_COOKIE = "gg_access_token";
const REFRESH_TOKEN_COOKIE = "gg_refresh_token";

export function setAuthCookies(accessToken: string, refreshToken: string): void {
  const cookieStore = cookies();
  
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export function clearAuthCookies(): void {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export function getAccessToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export function getRefreshToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

// ============================================
// Authentication Middleware
// ============================================

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    
    if (!token) {
      return { success: false, error: "No token provided" };
    }

    // Verify token
    const payload = verifyAccessToken(token);
    
    // Check session in database
    const sessionValid = await isSessionValid(token);
    if (!sessionValid) {
      return { success: false, error: "Session expired" };
    }

    // Get user from database
    const result = await query(
      "SELECT id, email, role, tfa_enabled, last_login, created_at, disabled FROM admins WHERE id = $1",
      [payload.userId]
    );

    if (result.rowCount === 0) {
      return { success: false, error: "User not found" };
    }

    const user = result.rows[0];
    
    if (user.disabled) {
      return { success: false, error: "Account disabled" };
    }

    return { success: true, user };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, error: "Token expired" };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, error: "Invalid token" };
    }
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

// ============================================
// Role-based Access Control
// ============================================

const ROLE_HIERARCHY: Record<string, number> = {
  uploader: 1,
  moderator: 2,
  editor: 3,
  superadmin: 4,
};

export function hasRole(userRole: string, requiredRole: string): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function requireRole(userRole: string, requiredRole: string): void {
  if (!hasRole(userRole, requiredRole)) {
    throw new Error("Insufficient permissions");
  }
}

// ============================================
// Audit Logging
// ============================================

export async function logAuditAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_logs (admin_id, action, target_type, target_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [adminId, action, targetType, targetId, details ? JSON.stringify(details) : null, ipAddress, userAgent]
    );
  } catch (error) {
    console.error("Failed to log audit action:", error);
    // Don't throw - audit logging should not break functionality
  }
}
