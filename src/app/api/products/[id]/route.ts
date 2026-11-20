import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Product [id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product." }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name?.trim(),
        slug: body.slug?.trim(),
        sku: body.sku?.trim().toUpperCase(),
        vertical: body.vertical,
        categoryId: body.categoryId,
        shortSummary: body.shortSummary?.trim(),
        description: body.description?.trim(),
        price: body.price !== undefined ? Number(body.price) : undefined,
        compareAtPrice: body.compareAtPrice !== undefined ? (body.compareAtPrice ? Number(body.compareAtPrice) : null) : undefined,
        gstPercent: body.gstPercent !== undefined ? Number(body.gstPercent) : undefined,
        stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        images: Array.isArray(body.images) ? JSON.stringify(body.images) : typeof body.images === "string" ? body.images : undefined,
        specifications: Array.isArray(body.specifications)
          ? JSON.stringify(body.specifications)
          : typeof body.specifications === "string"
          ? body.specifications
          : undefined,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Product error:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted." });
  } catch (error) {
    console.error("DELETE Product error:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 400 });
  }
}
