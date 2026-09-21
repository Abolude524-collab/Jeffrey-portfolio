import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAdmin } from "@/lib/auth/session";
import { projectSchema } from "@/lib/validation/schemas";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: {
        images: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    // Check slug uniqueness
    const existing = await prisma.project.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists. Please choose a unique slug." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
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

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
