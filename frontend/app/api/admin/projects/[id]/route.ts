import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAdmin } from "@/lib/auth/session";
import { projectSchema } from "@/lib/validation/schemas";
import { deleteImage } from "@/lib/cloudinary/media";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { order: "asc" } } },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check slug collision with other projects
    const existing = await prisma.project.findFirst({
      where: {
        slug: data.slug,
        NOT: { id: params.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug is already used by another project" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description || null,
        problem: data.problem || null,
        objective: data.objective || null,
        dataset: data.dataset || null,
        methodology: data.methodology || null,
        insights: data.insights || null,
        results: data.results || null,
        challenges: data.challenges || null,
        category: data.category,
        tags: data.tags,
        coverImage: data.coverImage,
        coverImagePublicId: data.coverImagePublicId || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        featured: data.featured,
        published: data.published,
        displayOrder: data.displayOrder,
      },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { images: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete cover image from Cloudinary if publicId exists
    if (project.coverImagePublicId) {
      await deleteImage(project.coverImagePublicId);
    }

    // Delete gallery images from Cloudinary
    for (const img of project.images) {
      if (img.publicId) {
        await deleteImage(img.publicId);
      }
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
