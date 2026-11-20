import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vertical = searchParams.get("vertical");

    const where: { vertical?: string } = {};
    if (vertical && (vertical === "RO" || vertical === "SOLAR")) {
      where.vertical = vertical;
    }

    const projects = await prisma.portfolioProject.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, vertical, location, capacity, summary, imageUrl } = body;

    if (!title || !vertical || !location || !capacity || !summary) {
      return NextResponse.json(
        { success: false, error: "Title, vertical, location, capacity, and summary are required" },
        { status: 400 }
      );
    }

    const project = await prisma.portfolioProject.create({
      data: {
        title: title.trim(),
        vertical,
        location: location.trim(),
        capacity: capacity.trim(),
        summary: summary.trim(),
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create portfolio project" },
      { status: 500 }
    );
  }
}
