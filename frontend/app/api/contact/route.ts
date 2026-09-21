import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { contactSchema } from "@/lib/validation/schemas";

// Simple in-memory rate limiting store (IP -> array of timestamps)
const rateLimitStore = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    // Rate limit check: max 5 requests per 10 minutes per IP
    const ip = request.headers.get("x-forwarded-for") || "client-ip";
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const userTimestamps = (rateLimitStore.get(ip) || []).filter(
      (ts) => now - ts < windowMs
    );

    if (userTimestamps.length >= 5) {
      return NextResponse.json(
        { error: "Too many contact requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    userTimestamps.push(now);
    rateLimitStore.set(ip, userTimestamps);

    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Persist to Neon PostgreSQL database via Prisma
    const savedMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || "Portfolio Inquiry",
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been sent successfully.",
        id: savedMessage.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
