import dynamic from "next/dynamic";

import { prisma } from "@/lib/prisma";

const PetMap = dynamic(() => import("@/components/map/pet-map").then((mod) => mod.PetMap), {
  ssr: false,
});

export default async function PetsPage({ params }: { params: { lang: string } }) {
  const pets = process.env.DATABASE_URL
    ? await prisma.pet
        .findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
        })
        .catch(() => [])
    : [
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
      ];

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
    <section className="grid gap-6">
      <div
        className="relative overflow-hidden rounded-md border border-border/70 px-6 py-10 text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,22,18,0.78), rgba(15,22,18,0.32)), url('/images/pets-cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl font-semibold">Pet Profiles</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">查看宠物档案、品种信息与地图位置。</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">新增宠物</button>
          <button className="rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-black">导出资料</button>
        </div>
      </div>
      <PetMap pins={pins} />
      <div className="grid gap-3 md:grid-cols-2">
        {pets.map((pet) => {
          const name =
            (pet.name as Record<string, string> | null)?.[params.lang] ??
            (pet.name as Record<string, string> | null)?.en ??
            "Pet";
          return (
            <article key={pet.id} className="rounded-md border border-border/70 bg-white p-4 shadow-sm">
              <h2 className="font-semibold">{name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pet.species}
                {pet.breed ? ` • ${pet.breed}` : ""}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {pet.weightKg ? `${pet.weightKg} kg` : "Weight N/A"} {pet.ageMonths ? `• ${pet.ageMonths} months` : ""}
              </p>
              <button className="mt-3 rounded-md border border-border px-3 py-1.5 text-xs font-semibold">查看档案</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
