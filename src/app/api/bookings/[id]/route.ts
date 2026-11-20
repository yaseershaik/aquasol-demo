import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.inspectionBooking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(
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
    const { status, assignedTech, notes, preferredDate, timeSlot } = body;

    // Also sync update to Python backend
    try {
      await fetch(`http://127.0.0.1:8000/api/py/bookings/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assigned_technician: assignedTech,
          notes,
        }),
      });
    } catch {}

    const existing = await prisma.inspectionBooking.findUnique({ where: { id } });
    if (!existing) {
      // Check if it exists in Python backend
      try {
        const pyRes = await fetch(`http://127.0.0.1:8000/api/py/bookings/track?ref=${encodeURIComponent(id)}`);
        if (pyRes.ok) {
          const pyData = await pyRes.json();
          if (pyData.success && pyData.inspection) {
            return NextResponse.json({
              success: true,
              booking: {
                id: pyData.inspection.id,
                bookingNumber: pyData.inspection.bookingReference,
                serviceType: pyData.inspection.vertical,
                customerName: pyData.inspection.customerName,
                customerPhone: pyData.inspection.customerPhone,
                address: pyData.inspection.address,
                pincode: pyData.inspection.pincode,
                preferredDate: pyData.inspection.preferredDate,
                timeSlot: pyData.inspection.preferredTimeSlot,
                assignedTech: pyData.inspection.assignedTechnician,
                status: pyData.inspection.status,
                notes: pyData.inspection.notes,
              },
            });
          }
        }
      } catch {}
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const updated = await prisma.inspectionBooking.update({
      where: { id },
      data: {
        status: status !== undefined ? status : existing.status,
        assignedTech: assignedTech !== undefined ? (assignedTech ? assignedTech.trim() : null) : existing.assignedTech,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : existing.notes,
        preferredDate: preferredDate !== undefined ? preferredDate.trim() : existing.preferredDate,
        timeSlot: timeSlot !== undefined ? timeSlot.trim() : existing.timeSlot,
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
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
    await prisma.inspectionBooking.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete booking" }, { status: 500 });
  }
}
