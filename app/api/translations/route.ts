import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const upsertTranslationSchema = z.object({
  key: z.string().min(1),
  values: z.record(z.string()),
  context: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const context = searchParams.get("context");
  const key = searchParams.get("key");

  const translations = await prisma.translation.findMany({
    where: {
      ...(context ? { context } : {}),
      ...(key ? { key } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ data: translations });
}

export async function POST(request: Request) {
  const payload = upsertTranslationSchema.parse(await request.json());

  const translation = await prisma.translation.upsert({
    where: { key: payload.key },
    create: payload,
    update: {
      values: payload.values,
      context: payload.context,
    },
  });

  return NextResponse.json({ data: translation }, { status: 201 });
}
