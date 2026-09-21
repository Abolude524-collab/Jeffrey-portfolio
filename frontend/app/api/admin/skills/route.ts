import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAdmin } from "@/lib/auth/session";
import { skillSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return NextResponse.json({ success: true, skills });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = skillSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, skill }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
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
      return NextResponse.json({ error: "Skill ID required" }, { status: 400 });
    }

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
