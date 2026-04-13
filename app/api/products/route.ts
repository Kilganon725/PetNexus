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
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      data: [
        {
          id: "demo-1",
          sku: "DRY-FOOD-01",
          name: { en: "Premium Dry Food", "zh-CN": "优选干粮", fr: "Croquettes Premium" },
          priceCents: 2999,
          currency: "USD",
        },
        {
          id: "demo-2",
          sku: "TOY-ROPE-02",
          name: { en: "Durable Rope Toy", "zh-CN": "耐咬绳结玩具", fr: "Jouet Corde Durable" },
          priceCents: 1599,
          currency: "USD",
        },
      ],
    });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 400 });
  }

  const body = await request.json();
  const payload = productSchema.parse(body);
  const product = await prisma.product.create({
    data: payload,
  });
  return NextResponse.json({ data: product }, { status: 201 });
}
