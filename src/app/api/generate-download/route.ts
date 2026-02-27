import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { generatePresignedDownloadUrl } from "@/lib/storage";
import { checkDownloadRateLimit, createDownloadToken, incrementDownloadCounter } from "@/lib/redis";
import { hashIp } from "@/lib/utils";

// Validation schema
const downloadRequestSchema = z.object({
  productSlug: z.string().min(1, "Product slug wajib diisi"),
  version: z.string().optional(),
  email: z.string().email().optional(),
  captchaToken: z.string().optional(),
});

// POST /api/generate-download - Generate download URL
export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || "unknown";
    const ipHash = hashIp(ip);

    // Rate limiting
    const rateLimit = await checkDownloadRateLimit(ipHash);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Batas download tercapai. Silakan coba lagi nanti.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = downloadRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: result.error.format() },
        { status: 400 }
      );
    }

    const { productSlug, version, email } = result.data;

    // Get product and release
    const productResult = await query(
      `SELECT p.id, p.title, p.slug, r.id as release_id, r.version, r.file_key, 
        r.file_size, r.checksum_sha256
       FROM products p
       JOIN releases r ON p.id = r.product_id
       WHERE p.slug = $1 
       AND p.status = 'published'
       AND r.scan_status = 'clean'
       AND ($2::text IS NULL OR r.version = $2)
       ORDER BY r.is_latest DESC, r.published_at DESC
       LIMIT 1`,
      [productSlug, version || null]
    );

    if (productResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Produk atau versi tidak ditemukan" },
        { status: 404 }
      );
    }

    const { 
      id: productId, 
      title, 
      slug, 
      release_id: releaseId, 
      version: releaseVersion, 
      file_key: fileKey, 
      file_size: fileSize, 
      checksum_sha256: checksum 
    } = productResult.rows[0];

    // Check product-specific rate limit
    const productRateLimit = await checkDownloadRateLimit(ipHash, productId);
    
    if (!productRateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Batas download untuk produk ini tercapai. Silakan coba lagi nanti.",
          resetAt: productRateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Generate presigned URL (30 minutes expiry)
    const { url, expiresAt } = await generatePresignedDownloadUrl(
      fileKey,
      `${slug}-${releaseVersion}.zip`,
      1800
    );

    // Create download token for tracking
    const downloadToken = crypto.randomUUID();
    await createDownloadToken(downloadToken, {
      productId,
      releaseId,
      ipHash,
    }, 1800);

    // Store email subscription if provided
    if (email) {
      try {
        await query(
          `INSERT INTO email_subscriptions (email, product_id) 
           VALUES ($1, $2)
           ON CONFLICT (email) DO UPDATE SET 
           product_id = EXCLUDED.product_id,
           subscribed_at = CURRENT_TIMESTAMP`,
          [email, productId]
        );
      } catch (error) {
        console.error("Email subscription error:", error);
        // Don't fail the download if email storage fails
      }
    }

    // Increment download counter
    await incrementDownloadCounter(productId, releaseId);

    // Log download stat
    await query(
      `INSERT INTO download_stats (product_id, release_id, ip_hash, bytes_transferred, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [productId, releaseId, ipHash, fileSize, request.headers.get("user-agent") || null]
    );

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: url,
        expiresAt,
        checksum,
        checksumAlgorithm: "SHA-256",
        filename: `${slug}-${releaseVersion}.zip`,
        fileSize,
        version: releaseVersion,
        verifyInstructions: "Gunakan perintah: certutil -hashfile <filename> SHA256 (Windows) atau sha256sum <filename> (Linux/Mac)",
      },
      rateLimit: {
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt,
      },
    });
  } catch (error) {
    console.error("Generate download error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
