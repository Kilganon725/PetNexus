import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const createPetSchema = z.object({
  ownerId: z.string().uuid(),
  name: z.record(z.string()),
  species: z.string().min(1),
  breed: z.string().optional(),
  ageMonths: z.number().int().nonnegative().optional(),
  weightKg: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
});

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      data: [
        {
          id: "demo-pet-1",
          name: { en: "Mochi", "zh-CN": "麻糬", fr: "Mochi" },
          species: "Dog",
          breed: "Shiba Inu",
          ageMonths: 18,
          weightKg: 9.5,
          locationLat: 31.2304,
          locationLng: 121.4737,
        },
        {
          id: "demo-pet-2",
          name: { en: "Luna", "zh-CN": "露娜", fr: "Luna" },
          species: "Cat",
          breed: "British Shorthair",
          ageMonths: 24,
          weightKg: 4.2,
          locationLat: 31.2222,
          locationLng: 121.4581,
        },
      ],
    });
  }

  const pets = await prisma.pet.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: pets });
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 400 });
  }

  const payload = createPetSchema.parse(await request.json());
  const pet = await prisma.pet.create({ data: payload });
  return NextResponse.json({ data: pet }, { status: 201 });
}
