import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aquasol_puregrid_master_secure_production_key_2026"
);

export async function GET(req: Request) {
  try {
    let token: string | null = null;

    // 1. Check Authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // 2. Check Cookie fallback
    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/aquasol_user_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.customerUser.findUnique({
      where: { id: payload.id as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company_name: user.companyName,
      companyName: user.companyName,
      gstin: user.gstin,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      role: user.role,
      is_active: user.isActive,
      created_at: user.createdAt.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    let token: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/aquasol_user_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await prisma.customerUser.update({
      where: { id: payload.id as string },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        phone: body.phone !== undefined ? body.phone : undefined,
        companyName: body.company_name !== undefined ? body.company_name : body.companyName,
        gstin: body.gstin !== undefined ? body.gstin : undefined,
        address: body.address !== undefined ? body.address : undefined,
        city: body.city !== undefined ? body.city : undefined,
        state: body.state !== undefined ? body.state : undefined,
        pincode: body.pincode !== undefined ? body.pincode : undefined,
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      company_name: updated.companyName,
      companyName: updated.companyName,
      gstin: updated.gstin,
      address: updated.address,
      city: updated.city,
      state: updated.state,
      pincode: updated.pincode,
      role: updated.role,
      is_active: updated.isActive,
      created_at: updated.createdAt.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
