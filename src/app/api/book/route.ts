import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import prisma from "@/lib/db";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const { success } = rateLimit(`booking:${ip}`, RATE_LIMITS.booking);
    if (!success) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate
    const validatedData = bookingSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Save to database and send confirmation
    await prisma.booking.create({
      data: {
        ...validatedData.data,
        preferredDate: new Date(validatedData.data.preferredDate),
      },
    });

    const dateStr = new Date(validatedData.data.preferredDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await sendBookingConfirmation(
      validatedData.data.email,
      validatedData.data.name,
      validatedData.data.visaType,
      dateStr
    );

    await sendAdminNotification("Booking", {
      Name: validatedData.data.name,
      "Visa Type": validatedData.data.visaType,
      Date: dateStr,
    });

    return NextResponse.json(
      { success: true, message: "Consultation booked successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Booking] Error:", error);
    return NextResponse.json(
      { error: "Failed to book consultation. Please try again." },
      { status: 500 }
    );
  }
}

