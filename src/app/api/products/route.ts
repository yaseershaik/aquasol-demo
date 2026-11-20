import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vertical = searchParams.get("vertical");
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");
    const query = searchParams.get("q");
    const all = searchParams.get("all");

    const where: any = {};
    if (all !== "true") {
      where.isPublished = true;
    }

    if (vertical && (vertical === "RO" || vertical === "SOLAR")) {
      where.vertical = vertical;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (query && query.trim()) {
      where.OR = [
        { name: { contains: query.trim() } },
        { shortSummary: { contains: query.trim() } },
        { sku: { contains: query.trim() } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Products error:", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      sku,
      vertical,
      categoryId,
      shortSummary,
      description,
      price,
      compareAtPrice,
      gstPercent,
      stockQuantity,
      isFeatured,
      isPublished,
      images,
      specifications,
    } = body;

    if (!name || !sku || !vertical || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: "Name, SKU, vertical, category, and price are required." },
        { status: 400 }
      );
    }

    const safeSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: safeSlug,
        sku: sku.trim().toUpperCase(),
        vertical,
        categoryId,
        shortSummary: shortSummary?.trim() || "",
        description: description?.trim() || "",
        price: Number(price) || 0,
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        gstPercent: Number(gstPercent) || 18,
        stockQuantity: Number(stockQuantity) || 0,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        images: Array.isArray(images) ? JSON.stringify(images) : typeof images === "string" ? images : "[]",
        specifications: Array.isArray(specifications)
          ? JSON.stringify(specifications)
          : typeof specifications === "string"
          ? specifications
          : "[]",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST Product error:", error);
    return NextResponse.json({ error: "Failed to create product. Check SKU/slug uniqueness." }, { status: 400 });
  }
}
