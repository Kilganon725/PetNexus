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
  const pets = await prisma.pet.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: pets });
}

export async function POST(request: Request) {
  const payload = createPetSchema.parse(await request.json());
  const pet = await prisma.pet.create({ data: payload });
  return NextResponse.json({ data: pet }, { status: 201 });
}
