import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!project || !project.published) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Fetch Project Detail Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project detail" },
      { status: 500 }
    );
  }
}
