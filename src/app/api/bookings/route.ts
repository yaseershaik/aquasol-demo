import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const serviceType = searchParams.get("serviceType");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (serviceType && serviceType !== "ALL") {
      where.serviceType = serviceType;
    }

    // 1. Fetch from Python backend
    let pyBookings: any[] = [];
    try {
      const url = new URL("http://127.0.0.1:8000/api/py/bookings/admin");
      if (status && status !== "ALL") url.searchParams.set("status", status);
      if (serviceType && serviceType !== "ALL") url.searchParams.set("vertical", serviceType);
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (res.ok) {
        const raw = await res.json();
        if (Array.isArray(raw)) {
          pyBookings = raw.map((b: any) => ({
            id: b.id,
            bookingNumber: b.booking_reference,
            serviceType: b.vertical,
            customerName: b.customer_name,
            customerPhone: b.customer_phone,
            customerEmail: b.customer_email,
            address: b.address,
            city: "",
            pincode: b.pincode,
            preferredDate: b.preferred_date,
            timeSlot: b.preferred_time_slot,
            notes: b.notes,
            assignedTech: b.assigned_technician,
            technicianPhone: b.technician_phone,
            status: b.status,
            createdAt: b.created_at,
          }));
        }
      }
    } catch {}

    // 2. Fetch from Prisma
    const prismaBookings = await prisma.inspectionBooking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const seen = new Set<string>();
    const mergedBookings: any[] = [];
    for (const b of [...pyBookings, ...prismaBookings]) {
      if (!seen.has(b.bookingNumber)) {
        seen.add(b.bookingNumber);
        mergedBookings.push(b);
      }
    }

    return NextResponse.json({ success: true, bookings: mergedBookings });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serviceType = body.serviceType || body.vertical;
    const customerName = body.customerName || body.customer_name;
    const customerPhone = body.customerPhone || body.customer_phone;
    const customerEmail = body.customerEmail || body.customer_email;
    const address = body.address;
    const city = body.city;
    const pincode = body.pincode;
    const preferredDate = body.preferredDate || body.preferred_date;
    const timeSlot = body.timeSlot || body.preferred_time_slot;
    const notes = body.notes;

    if (!serviceType || !customerName || !customerPhone || !address || !city || !pincode || !preferredDate || !timeSlot) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required booking details." },
        { status: 400 }
      );
    }

    const bookingNumber = `INS-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const booking = await prisma.inspectionBooking.create({
      data: {
        bookingNumber,
        serviceType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        preferredDate: preferredDate.trim(),
        timeSlot: timeSlot.trim(),
        notes: notes ? notes.trim() : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      booking_reference: booking.bookingNumber,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      vertical: booking.serviceType,
      preferred_date: booking.preferredDate,
      preferred_time_slot: booking.timeSlot,
      status: booking.status,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to schedule inspection booking" },
      { status: 500 }
    );
  }
}
