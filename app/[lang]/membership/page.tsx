import { prisma } from "@/lib/prisma";

export default async function MembershipPage({ params }: { params: { lang: string } }) {
  const plans = await prisma.membershipPlan
    .findMany({
      where: { isActive: true },
      orderBy: { priceCents: "asc" },
    })
    .catch(() => []);

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Membership</h1>
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((plan) => {
          const name =
            (plan.name as Record<string, string> | null)?.[params.lang] ??
            (plan.name as Record<string, string> | null)?.en ??
            plan.code;

          return (
            <article key={plan.id} className="rounded-md border p-4">
              <h2 className="font-medium">{name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                ${(plan.priceCents / 100).toFixed(2)} / {plan.interval.toLowerCase()}
              </p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
                  Stripe
                </button>
                <button className="rounded-md border px-3 py-2 text-sm">PayPal</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
