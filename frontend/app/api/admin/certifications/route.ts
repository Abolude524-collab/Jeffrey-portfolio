import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAdmin } from "@/lib/auth/session";
import { certificationSchema } from "@/lib/validation/schemas";
import { deleteImage } from "@/lib/cloudinary/media";

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, certifications });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = certificationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const certification = await prisma.certification.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, certification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const cert = await prisma.certification.findUnique({ where: { id } });
    if (cert?.imagePublicId) {
      await deleteImage(cert.imagePublicId);
    }

    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
