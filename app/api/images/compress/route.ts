import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const compressed = await sharp(bytes)
    .rotate()
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return NextResponse.json({
    mimeType: "image/webp",
    size: compressed.length,
  });
}
