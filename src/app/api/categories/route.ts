import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vertical = searchParams.get("vertical");

    const whereClause: { vertical?: string } = {};
    if (vertical === "RO" || vertical === "SOLAR") {
      whereClause.vertical = vertical;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { name, slug, vertical, description } = await req.json();

    if (!name || !vertical) {
      return NextResponse.json({ error: "Name and vertical (RO / SOLAR) are required." }, { status: 400 });
    }

    const safeSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: safeSlug,
        vertical,
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST Category error:", error);
    return NextResponse.json({ error: "Failed to create category or slug exists." }, { status: 400 });
  }
}
