import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const where: any = {
      published: true,
    };

    if (featuredOnly) {
      where.featured = true;
    }

    if (category && category !== "All") {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (tag && tag !== "All") {
      where.tags = {
        has: tag,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
