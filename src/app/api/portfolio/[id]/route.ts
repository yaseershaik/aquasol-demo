import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("GET /api/portfolio/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, vertical, location, capacity, summary, imageUrl } = body;

    const existing = await prisma.portfolioProject.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        vertical: vertical !== undefined ? vertical : existing.vertical,
        location: location !== undefined ? location.trim() : existing.location,
        capacity: capacity !== undefined ? capacity.trim() : existing.capacity,
        summary: summary !== undefined ? summary.trim() : existing.summary,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error("PUT /api/portfolio/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.portfolioProject.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/portfolio/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
