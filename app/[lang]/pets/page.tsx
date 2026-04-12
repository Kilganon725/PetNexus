import dynamic from "next/dynamic";

import { prisma } from "@/lib/prisma";

const PetMap = dynamic(() => import("@/components/map/pet-map").then((mod) => mod.PetMap), {
  ssr: false,
});

export default async function PetsPage({ params }: { params: { lang: string } }) {
  const pets = await prisma.pet.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const pins = pets
    .filter((pet) => pet.locationLat !== null && pet.locationLng !== null)
    .map((pet) => ({
      id: pet.id,
      name:
        ((pet.name as Record<string, string> | null)?.[params.lang] ??
          (pet.name as Record<string, string> | null)?.en ??
          "Pet"),
      lat: pet.locationLat as number,
      lng: pet.locationLng as number,
    }));

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Pet Profiles</h1>
      <PetMap pins={pins} />
      <div className="grid gap-3 md:grid-cols-2">
        {pets.map((pet) => {
          const name =
            (pet.name as Record<string, string> | null)?.[params.lang] ??
            (pet.name as Record<string, string> | null)?.en ??
            "Pet";
          return (
            <article key={pet.id} className="rounded-md border p-4">
              <h2 className="font-medium">{name}</h2>
              <p className="text-sm text-muted-foreground">
                {pet.species}
                {pet.breed ? ` • ${pet.breed}` : ""}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
