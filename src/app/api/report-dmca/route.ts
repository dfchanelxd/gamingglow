import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { checkRateLimit } from "@/lib/redis";

// Validation schema
const dmcaReportSchema = z.object({
  productId: z.string().uuid().optional(),
  productSlug: z.string().optional(),
  claimantName: z.string().min(2, "Nama wajib diisi").max(255),
  claimantEmail: z.string().email("Email tidak valid"),
  claimantAddress: z.string().min(10, "Alamat lengkap wajib diisi"),
  infringingMaterial: z.string().min(10, "Deskripsi materi wajib diisi"),
  originalMaterial: z.string().min(10, "Deskripsi materi asli wajib diisi"),
  goodFaithStatement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyatakan keyakinan baik",
  }),
  accuracyStatement: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyatakan keakuratan informasi",
  }),
  signature: z.string().min(2, "Tanda tangan wajib diisi"),
  evidenceLinks: z.array(z.string().url()).default([]),
  captchaToken: z.string().optional(),
});

// POST /api/report-dmca - Submit DMCA claim
export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || "unknown";

    // Rate limiting - 3 claims per hour per IP
    const rateLimit = await checkRateLimit(`dmca:${ip}`, 3, 3600);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Terlalu banyak laporan. Maksimal 3 laporan per jam.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = dmcaReportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Find product if slug provided
    let productId = data.productId;
    
    if (!productId && data.productSlug) {
      const productResult = await query(
        "SELECT id FROM products WHERE slug = $1",
        [data.productSlug]
      );
      
      if (productResult.rowCount && productResult.rowCount > 0) {
        productId = productResult.rows[0].id;
      }
    }

    // Insert DMCA claim
    const insertResult = await query(
      `INSERT INTO dmca_claims (
        product_id, claimant_name, claimant_email, claimant_address,
        infringing_material, original_material, good_faith_statement,
        accuracy_statement, signature, evidence_links, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        productId || null,
        data.claimantName,
        data.claimantEmail,
        data.claimantAddress,
        data.infringingMaterial,
        data.originalMaterial,
        data.goodFaithStatement,
        data.accuracyStatement,
        data.signature,
        JSON.stringify(data.evidenceLinks),
        "pending",
      ]
    );

    const claimId = insertResult.rows[0].id;

    // TODO: Send email notification to admin
    // await sendDMCANotification({
    //   claimId,
    //   claimantEmail: data.claimantEmail,
    //   productId,
    // });

    return NextResponse.json({
      success: true,
      data: {
        claimId,
        status: "pending",
        message: "Laporan DMCA berhasil dikirim. Kami akan meninjau dalam 24-48 jam.",
      },
    }, { status: 201 });
  } catch (error) {
    console.error("DMCA report error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// GET /api/report-dmca - Get DMCA policy info (public)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      policy: {
        title: "Kebijakan DMCA GAMINGGLOW",
        description: "GAMINGGLOW menghormati hak kekayaan intelektual orang lain dan mematuhi Digital Millennium Copyright Act (DMCA).",
        process: [
          "Ajukan laporan lengkap dengan informasi yang diperlukan",
          "Tim kami akan meninjau dalam 24-48 jam",
          "Jika valid, konten akan ditangguhkan sementara",
          "Pemilik konten dapat mengajukan counter-notification",
        ],
        requiredInfo: [
          "Tanda tangan fisik atau elektronik",
          "Identifikasi materi yang dilaporkan",
          "Informasi kontak lengkap",
          "Pernyataan keyakinan baik",
          "Pernyataan keakuratan",
        ],
        contact: {
          email: process.env.DMCA_EMAIL || "dmca@gamingglow.local",
          responseTime: "24-48 jam",
        },
      },
    },
  });
}
