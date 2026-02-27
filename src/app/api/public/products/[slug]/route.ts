import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCache, setCache } from "@/lib/redis";
import { SoftwareApplicationSchema } from "@/types";

// GET /api/public/products/:slug - Get product details
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Try cache first
    const cacheKey = `product:${slug}`;
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Get product with releases and images
    const productResult = await query(
      `SELECT p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'version', r.version,
              'changelog', r.changelog,
              'fileSize', r.file_size,
              'checksumSha256', r.checksum_sha256,
              'scanStatus', r.scan_status,
              'downloadCount', r.download_count,
              'isLatest', r.is_latest,
              'publishedAt', r.published_at
            ) ORDER BY r.is_latest DESC, r.published_at DESC
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as releases,
        COALESCE(
          json_agg(
            json_build_object(
              'id', i.id,
              'type', i.type,
              'url', i.path,
              'width', i.width,
              'height', i.height,
              'order', i.order
            ) ORDER BY i.order
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'
        ) as images
       FROM products p
       LEFT JOIN releases r ON p.id = r.product_id AND r.scan_status = 'clean'
       LEFT JOIN images i ON p.id = i.product_id
       WHERE p.slug = $1 AND p.status = 'published'
       GROUP BY p.id`,
      [slug]
    );

    if (productResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    // Get latest release
    const latestRelease = product.releases?.find((r: any) => r.isLatest) || product.releases?.[0];

    // Generate JSON-LD schema
    const jsonLd: SoftwareApplicationSchema = {
      "@context": "https://schema.org",
      "@type": product.type === "game" ? "VideoGame" : "SoftwareApplication",
      name: product.title,
      description: product.description,
      applicationCategory: product.type === "game" ? "Game" : "SoftwareApplication",
      operatingSystem: product.system_requirements?.minimum?.os || "Windows",
      softwareVersion: latestRelease?.version,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        ratingCount: String(latestRelease?.downloadCount || 0),
      },
      image: product.images?.find((i: any) => i.type === "cover")?.url,
      publisher: product.publisher,
      datePublished: product.published_at,
    };

    const response = {
      ...product,
      jsonLd,
    };

    // Cache for 5 minutes
    await setCache(cacheKey, response, 300);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
