import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const createLanguageSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(1),
  isDefault: z.boolean().optional().default(false),
  isEnabled: z.boolean().optional().default(true),
});

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      data: [
        { id: "1", code: "zh-CN", name: "中文", isDefault: false, isEnabled: true },
        { id: "2", code: "en", name: "English", isDefault: true, isEnabled: true },
        { id: "3", code: "fr", name: "Français", isDefault: false, isEnabled: true },
      ],
    });
  }

  const languages = await prisma.language.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ data: languages });
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 400 });
  }

  const payload = createLanguageSchema.parse(await request.json());

  const language = await prisma.$transaction(async (tx) => {
    if (payload.isDefault) {
      await tx.language.updateMany({ data: { isDefault: false } });
    }
    return tx.language.create({ data: payload });
  });

  return NextResponse.json({ data: language }, { status: 201 });
}
