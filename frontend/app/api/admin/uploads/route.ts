import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { uploadImageBuffer } from "@/lib/cloudinary/media";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "jeffrey-portfolio";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds limit of 10MB" },
        { status: 400 }
      );
    }

    // Validate MIME type
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed formats: JPG, PNG, WEBP, GIF, SVG" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageBuffer(buffer, folder);

    return NextResponse.json({
      success: true,
      file: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload media file" },
      { status: 500 }
    );
  }
}
