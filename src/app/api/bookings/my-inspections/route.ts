import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aquasol_puregrid_master_secure_production_key_2026"
);

export async function GET(req: Request) {
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
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const email = (payload.email as string).toLowerCase().trim();

    // Fetch user phone from CustomerUser to match bookings
    const user = await prisma.customerUser.findUnique({
      where: { id: payload.id as string },
    });

    const bookings = await prisma.inspectionBooking.findMany({
      where: {
        OR: [
          { customerEmail: email },
          ...(user?.phone ? [{ customerPhone: user.phone }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      booking_reference: b.bookingNumber,
      customer_name: b.customerName,
      customer_phone: b.customerPhone,
      vertical: b.serviceType,
      preferred_date: b.preferredDate,
      preferred_time_slot: b.timeSlot,
      address: `${b.address}, ${b.city}`,
      pincode: b.pincode,
      status: b.status,
      assigned_technician: b.assignedTech || "Pending Assignment",
      technician_phone: "+91 98765 43210",
      notes: b.notes || "",
      created_at: b.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/bookings/my-inspections error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
