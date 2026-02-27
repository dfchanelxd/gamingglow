import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCache, setCache } from "@/lib/redis";

// GET /api/public/stats - Get public statistics
export async function GET(request: NextRequest) {
  try {
    // Try cache
    const cacheKey = "public:stats";
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Get stats
    const [
      totalDownloadsResult,
      totalProductsResult,
      storageResult,
    ] = await Promise.all([
      query("SELECT COUNT(*) as count FROM download_stats", []),
      query("SELECT COUNT(*) as count FROM products WHERE status = 'published'", []),
      query(
        `SELECT COALESCE(SUM(file_size), 0) as total FROM releases 
         WHERE scan_status = 'clean'`,
        []
      ),
    ]);

    const stats = {
      totalDownloads: parseInt(totalDownloadsResult.rows[0]?.count || "0"),
      totalProducts: parseInt(totalProductsResult.rows[0]?.count || "0"),
      storageUsed: Math.round((storageResult.rows[0]?.total || 0) / (1024 * 1024 * 1024)),
    };

    // Cache for 5 minutes
    await setCache(cacheKey, stats, 300);

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
