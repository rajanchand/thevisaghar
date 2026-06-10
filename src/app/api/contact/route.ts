import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import prisma from "@/lib/db";
import { sendInquiryConfirmation, sendAdminNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const { success } = rateLimit(`contact:${ip}`, RATE_LIMITS.contact);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate
    const validatedData = contactSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Save to database and send email
    await prisma.inquiry.create({ data: validatedData.data });
    await sendInquiryConfirmation(validatedData.data.email, validatedData.data.name, validatedData.data.visaType);
    await sendAdminNotification("Inquiry", { Name: validatedData.data.name, Email: validatedData.data.email, "Visa Type": validatedData.data.visaType });

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}

