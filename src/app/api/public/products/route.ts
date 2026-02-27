import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCache, setCache } from "@/lib/redis";

// GET /api/public/products - List public products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type") as "game" | "software" | null;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const staffPick = searchParams.get("staffPick") === "true";
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    // Build cache key
    const cacheKey = `products:${type}:${category}:${featured}:${staffPick}:${search}:${page}:${limit}`;
    
    // Try cache
    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Build query
    let whereClause = "WHERE p.status = 'published'";
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      whereClause += ` AND p.type = $${paramIndex++}`;
      params.push(type);
    }

    if (category) {
      whereClause += ` AND p.category = $${paramIndex++}`;
      params.push(category);
    }

    if (featured) {
      whereClause += ` AND p.featured = TRUE`;
    }

    if (staffPick) {
      whereClause += ` AND p.staff_pick = TRUE`;
    }

    if (search) {
      whereClause += ` AND (p.title ILIKE $${paramIndex} OR p.search_vector @@ plainto_tsquery('indonesian', $${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get products
    const productsResult = await query(
      `SELECT p.id, p.slug, p.title, p.tagline, p.type, p.category, 
        p.featured, p.staff_pick, p.publisher, p.published_at,
        COALESCE(
          json_agg(
            json_build_object(
              'type', i.type,
              'url', i.path,
              'order', i.order
            ) ORDER BY i.order
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'
        ) as images,
        COALESCE(
          json_agg(
            json_build_object(
              'version', r.version,
              'fileSize', r.file_size,
              'downloadCount', r.download_count,
              'isLatest', r.is_latest
            ) ORDER BY r.is_latest DESC
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as releases
       FROM products p
       LEFT JOIN images i ON p.id = i.product_id
       LEFT JOIN releases r ON p.id = r.product_id AND r.scan_status = 'clean'
       ${whereClause}
       GROUP BY p.id
       ORDER BY p.featured DESC, p.staff_pick DESC, p.published_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset]
    );

    const response = {
      products: productsResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 5 minutes
    await setCache(cacheKey, response, 300);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("List products error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
