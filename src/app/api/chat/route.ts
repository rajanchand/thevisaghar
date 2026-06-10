import { NextRequest, NextResponse } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are Visa Ghar AI, a helpful assistant for The Visa Ghar immigration consultancy based in Kathmandu, Nepal.

Your role:
- Answer questions about UK, Schengen, and Australia visa processes, document requirements, and eligibility
- Provide general information about processing times, costs, and procedures
- Always recommend booking a free consultation for complex or case-specific questions
- Be professional, concise, and warm
- Use bullet points and clear formatting for readability

Important rules:
- Do NOT give specific legal advice
- Do NOT guarantee visa approval
- Do NOT provide information about other consultancies
- Always mention that The Visa Ghar offers free consultations
- If unsure, recommend speaking with a consultant
- Keep responses under 300 words unless the question requires more detail`;

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI chat is not configured. Please contact us directly." },
        { status: 503 }
      );
    }

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const { success } = rateLimit(`chat:${ip}`, RATE_LIMITS.chat);
    if (!success) {
      return NextResponse.json(
        { error: "Chat limit reached. Please try again later or contact us directly." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
    }

    if (messages.length === 0) {
      return NextResponse.json({ error: "Messages array cannot be empty." }, { status: 400 });
    }

    const validRoles = new Set(["user", "assistant", "system"]);
    for (const msg of messages) {
      if (
        !msg ||
        typeof msg !== "object" ||
        !validRoles.has(msg.role) ||
        typeof msg.content !== "string" ||
        msg.content.trim().length === 0 ||
        msg.content.length > 2000
      ) {
        return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
      }
    }

    if (messages[messages.length - 1].role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user." },
        { status: 400 }
      );
    }

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[Chat] Error:", error);
    return NextResponse.json(
      { error: "AI chat encountered an error. Please try again." },
      { status: 500 }
    );
  }
}
