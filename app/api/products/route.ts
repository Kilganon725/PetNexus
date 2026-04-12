import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  sku: z.string().min(1),
  priceCents: z.number().int().positive(),
  currency: z.string().default("USD"),
  stock: z.number().int().nonnegative().default(0),
  imageUrl: z.string().url().optional(),
  name: z.record(z.string()),
  description: z.record(z.string()).optional(),
});

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  const body = await request.json();
  const payload = productSchema.parse(body);
  const product = await prisma.product.create({
    data: payload,
  });
  return NextResponse.json({ data: product }, { status: 201 });
}
