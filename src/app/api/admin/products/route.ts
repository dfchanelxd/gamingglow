import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { authenticateRequest, hasRole, logAuditAction } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { Product, ProductStatus } from "@/types";

// Validation schemas
const createProductSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(255),
  tagline: z.string().max(500).optional(),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  type: z.enum(["game", "software"]),
  category: z.string().min(1, "Kategori wajib dipilih"),
  publisher: z.string().min(1, "Publisher wajib diisi"),
  developer: z.string().optional(),
  tags: z.array(z.string()).default([]),
  languages: z.array(z.string()).default(["Indonesia", "English"]),
  systemRequirements: z.object({
    minimum: z.object({
      os: z.string(),
      processor: z.string(),
      memory: z.string(),
      graphics: z.string(),
      storage: z.string(),
      directX: z.string().optional(),
      additionalNotes: z.string().optional(),
    }),
    recommended: z.object({
      os: z.string(),
      processor: z.string(),
      memory: z.string(),
      graphics: z.string(),
      storage: z.string(),
      directX: z.string().optional(),
      additionalNotes: z.string().optional(),
    }),
  }).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  status: z.enum(["draft", "staging", "published"]).default("draft"),
  scheduledAt: z.string().datetime().optional().nullable(),
});

const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid(),
});

// GET /api/admin/products - List products
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") as ProductStatus | null;
    const type = searchParams.get("type") as "game" | "software" | null;
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const offset = (page - 1) * limit;

    // Build query
    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND p.status = $${paramIndex++}`;
      params.push(status);
    }

    if (type) {
      whereClause += ` AND p.type = $${paramIndex++}`;
      params.push(type);
    }

    if (category) {
      whereClause += ` AND p.category = $${paramIndex++}`;
      params.push(category);
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
      `SELECT p.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'version', r.version,
              'fileSize', r.file_size,
              'scanStatus', r.scan_status,
              'isLatest', r.is_latest,
              'publishedAt', r.published_at
            ) ORDER BY r.uploaded_at DESC
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as releases
       FROM products p
       LEFT JOIN releases r ON p.id = r.product_id
       ${whereClause}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: productsResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List products error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create product
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Only editors and above can create products
    if (!hasRole(auth.user.role, "editor")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    const slug = slugify(data.title);

    // Check if slug exists
    const existingResult = await query(
      "SELECT id FROM products WHERE slug = $1",
      [slug]
    );

    if (existingResult.rowCount && existingResult.rowCount > 0) {
      return NextResponse.json(
        { success: false, error: "Produk dengan nama serupa sudah ada" },
        { status: 409 }
      );
    }

    // Insert product
    const insertResult = await query(
      `INSERT INTO products (
        slug, title, tagline, description, type, category, 
        publisher, developer, status, tags, languages, 
        system_requirements, meta_title, meta_description, 
        scheduled_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        slug,
        data.title,
        data.tagline,
        data.description,
        data.type,
        data.category,
        data.publisher,
        data.developer,
        data.status,
        JSON.stringify(data.tags),
        JSON.stringify(data.languages),
        data.systemRequirements ? JSON.stringify(data.systemRequirements) : null,
        data.metaTitle,
        data.metaDescription,
        data.scheduledAt,
        auth.user.id,
      ]
    );

    const product = insertResult.rows[0];

    // Log audit
    await logAuditAction(
      auth.user.id,
      "PRODUCT_CREATED",
      "product",
      product.id,
      { title: data.title, slug, status: data.status },
      request.ip || undefined,
      request.headers.get("user-agent") || undefined
    );

    return NextResponse.json({
      success: true,
      data: product,
      message: "Produk berhasil dibuat",
    }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products - Update product
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    if (!hasRole(auth.user.role, "editor")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = updateProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: result.error.format() },
        { status: 400 }
      );
    }

    const { id, ...updateData } = result.data;

    // Check if product exists
    const existingResult = await query(
      "SELECT id FROM products WHERE id = $1",
      [id]
    );

    if (existingResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.title) {
      updates.push(`title = $${paramIndex++}`);
      values.push(updateData.title);
      updates.push(`slug = $${paramIndex++}`);
      values.push(slugify(updateData.title));
    }

    if (updateData.tagline !== undefined) {
      updates.push(`tagline = $${paramIndex++}`);
      values.push(updateData.tagline);
    }

    if (updateData.description) {
      updates.push(`description = $${paramIndex++}`);
      values.push(updateData.description);
    }

    if (updateData.type) {
      updates.push(`type = $${paramIndex++}`);
      values.push(updateData.type);
    }

    if (updateData.category) {
      updates.push(`category = $${paramIndex++}`);
      values.push(updateData.category);
    }

    if (updateData.publisher) {
      updates.push(`publisher = $${paramIndex++}`);
      values.push(updateData.publisher);
    }

    if (updateData.developer !== undefined) {
      updates.push(`developer = $${paramIndex++}`);
      values.push(updateData.developer);
    }

    if (updateData.tags) {
      updates.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(updateData.tags));
    }

    if (updateData.languages) {
      updates.push(`languages = $${paramIndex++}`);
      values.push(JSON.stringify(updateData.languages));
    }

    if (updateData.systemRequirements) {
      updates.push(`system_requirements = $${paramIndex++}`);
      values.push(JSON.stringify(updateData.systemRequirements));
    }

    if (updateData.metaTitle !== undefined) {
      updates.push(`meta_title = $${paramIndex++}`);
      values.push(updateData.metaTitle);
    }

    if (updateData.metaDescription !== undefined) {
      updates.push(`meta_description = $${paramIndex++}`);
      values.push(updateData.metaDescription);
    }

    if (updateData.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(updateData.status);
      
      if (updateData.status === "published") {
        updates.push(`published_at = $${paramIndex++}`);
        values.push(new Date());
      }
    }

    if (updateData.scheduledAt !== undefined) {
      updates.push(`scheduled_at = $${paramIndex++}`);
      values.push(updateData.scheduledAt);
    }

    updates.push(`updated_at = NOW()`);

    values.push(id);

    const updateResult = await query(
      `UPDATE products SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    // Log audit
    await logAuditAction(
      auth.user.id,
      "PRODUCT_UPDATED",
      "product",
      id,
      { updates: Object.keys(updateData) },
      request.ip || undefined,
      request.headers.get("user-agent") || undefined
    );

    return NextResponse.json({
      success: true,
      data: updateResult.rows[0],
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (!auth.success || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Only superadmin can delete products
    if (!hasRole(auth.user.role, "superadmin")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID produk diperlukan" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingResult = await query(
      "SELECT id, title FROM products WHERE id = $1",
      [id]
    );

    if (existingResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const productTitle = existingResult.rows[0].title;

    // Delete product (cascades to releases, images)
    await query("DELETE FROM products WHERE id = $1", [id]);

    // Log audit
    await logAuditAction(
      auth.user.id,
      "PRODUCT_DELETED",
      "product",
      id,
      { title: productTitle },
      request.ip || undefined,
      request.headers.get("user-agent") || undefined
    );

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
