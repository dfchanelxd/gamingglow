import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authenticateRequest, hasRole } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { DashboardStats } from "@/types";

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admin roles can access stats
    if (!hasRole(auth.user.role, "editor")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Parallel queries for better performance
    const [
      downloadsTodayResult,
      downloadsWeekResult,
      downloadsMonthResult,
      totalDownloadsResult,
      totalProductsResult,
      pendingUploadsResult,
      storageResult,
      pendingDMCAResult,
      recentDownloadsResult,
      topProductsResult,
    ] = await Promise.all([
      // Downloads today
      query(
        `SELECT COUNT(*) as count FROM download_stats 
         WHERE timestamp >= CURRENT_DATE`,
        []
      ),

      // Downloads this week
      query(
        `SELECT COUNT(*) as count FROM download_stats 
         WHERE timestamp >= $1`,
        [weekAgo]
      ),

      // Downloads this month
      query(
        `SELECT COUNT(*) as count FROM download_stats 
         WHERE timestamp >= $1`,
        [monthAgo]
      ),

      // Total downloads
      query("SELECT COUNT(*) as count FROM download_stats", []),

      // Total products
      query("SELECT COUNT(*) as count FROM products WHERE status = 'published'", []),

      // Pending uploads (releases with pending scan)
      query(
        `SELECT COUNT(*) as count FROM releases 
         WHERE scan_status IN ('pending', 'scanning')`,
        []
      ),

      // Storage used (sum of file sizes)
      query(
        `SELECT COALESCE(SUM(file_size), 0) as total FROM releases 
         WHERE scan_status = 'clean'`,
        []
      ),

      // Pending DMCA claims
      query(
        `SELECT COUNT(*) as count FROM dmca_claims 
         WHERE status IN ('pending', 'under_review')`,
        []
      ),

      // Recent downloads
      query(
        `SELECT p.title, r.version, ds.timestamp, ds.ip_hash
         FROM download_stats ds
         JOIN products p ON ds.product_id = p.id
         JOIN releases r ON ds.release_id = r.id
         ORDER BY ds.timestamp DESC
         LIMIT 10`,
        []
      ),

      // Top products
      query(
        `SELECT p.id, p.title, p.slug, p.type, COUNT(ds.id) as download_count
         FROM products p
         LEFT JOIN download_stats ds ON p.id = ds.product_id
         WHERE p.status = 'published'
         GROUP BY p.id
         ORDER BY download_count DESC
         LIMIT 5`,
        []
      ),
    ]);

    // Calculate storage (convert bytes to GB)
    const storageUsed = Math.round((storageResult.rows[0]?.total || 0) / (1024 * 1024 * 1024));
    const storageLimit = 1000; // 1TB limit (configurable)

    const stats: DashboardStats = {
      downloadsToday: parseInt(downloadsTodayResult.rows[0]?.count || "0"),
      downloadsThisWeek: parseInt(downloadsWeekResult.rows[0]?.count || "0"),
      downloadsThisMonth: parseInt(downloadsMonthResult.rows[0]?.count || "0"),
      totalDownloads: parseInt(totalDownloadsResult.rows[0]?.count || "0"),
      totalProducts: parseInt(totalProductsResult.rows[0]?.count || "0"),
      pendingUploads: parseInt(pendingUploadsResult.rows[0]?.count || "0"),
      storageUsed,
      storageLimit,
      pendingDMCAClaims: parseInt(pendingDMCAResult.rows[0]?.count || "0"),
      recentDownloads: recentDownloadsResult.rows.map((row: any) => ({
        productTitle: row.title,
        version: row.version,
        timestamp: row.timestamp,
        ipHash: row.ip_hash,
      })),
      topProducts: topProductsResult.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        downloadCount: parseInt(row.download_count),
        type: row.type,
      })),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
