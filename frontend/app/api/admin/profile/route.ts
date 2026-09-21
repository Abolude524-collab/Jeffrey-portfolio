import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAdmin } from "@/lib/auth/session";
import { profileSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const existing = await prisma.profile.findFirst();

    const profile = existing
      ? await prisma.profile.update({
          where: { id: existing.id },
          data: result.data,
        })
      : await prisma.profile.create({
          data: {
            name: result.data.name,
            title: result.data.title,
            bio: result.data.bio,
            profileImageUrl: result.data.profileImageUrl || null,
            profileImagePublicId: result.data.profileImagePublicId || null,
            resumeUrl: result.data.resumeUrl || null,
            githubUrl: result.data.githubUrl || null,
            linkedinUrl: result.data.linkedinUrl || null,
            email: result.data.email || null,
          },
        });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
