import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { sendBookingConfirmation } from "@/lib/email";

// PATCH update booking status, notes, or date
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const { success: rateLimitOk } = rateLimit(`adminWrite:${ip}`, RATE_LIMITS.adminWrite);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "Too many write requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes, preferredDate } = body;

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(preferredDate ? { preferredDate: new Date(preferredDate) } : {}),
      },
    });

    // If status transitioned to CONFIRMED, we can optionally resend confirmation email
    if (status === "CONFIRMED" && booking.status !== "CONFIRMED") {
      const dateStr = new Date(updatedBooking.preferredDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      await sendBookingConfirmation(
        updatedBooking.email,
        updatedBooking.name,
        updatedBooking.visaType,
        `CONFIRMED - ${dateStr}`
      );
    }

    // Audit log
    await logAudit({
      action: "UPDATE_STATUS",
      entity: "Booking",
      entityId: id,
      userId: session.user.id,
      details: { name: booking.name, status, preferredDate },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("[Admin Bookings PATCH Error]:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE booking by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const { success: rateLimitOk } = rateLimit(`adminWrite:${ip}`, RATE_LIMITS.adminWrite);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "Too many write requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    // Audit log
    await logAudit({
      action: "DELETE",
      entity: "Booking",
      entityId: id,
      userId: session.user.id,
      details: { name: booking.name, email: booking.email },
    });

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("[Admin Bookings DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
