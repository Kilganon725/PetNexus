import { prisma } from "@/lib/prisma";

export default async function MembershipPage({ params }: { params: { lang: string } }) {
  const plans = process.env.DATABASE_URL
    ? await prisma.membershipPlan
        .findMany({
          where: { isActive: true },
          orderBy: { priceCents: "asc" },
        })
        .catch(() => [])
    : [
        {
          id: "starter",
          code: "STARTER",
          name: { en: "Starter", "zh-CN": "入门版", fr: "Debut" },
          priceCents: 999,
          interval: "MONTHLY",
        },
        {
          id: "pro",
          code: "PRO",
          name: { en: "Pro", "zh-CN": "专业版", fr: "Pro" },
          priceCents: 1999,
          interval: "MONTHLY",
        },
      ];

  return (
    <section className="grid gap-6">
      <div
        className="relative overflow-hidden rounded-md border border-border/70 px-6 py-10 text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,18,16,0.75), rgba(10,18,16,0.3)), url('/images/membership-cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl font-semibold">Membership</h1>
        <p className="mt-2 text-sm text-white/85">选择订阅计划并使用 Stripe 或 PayPal 支付。</p>
        <button className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
          对比全部方案
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((plan) => {
          const name =
            (plan.name as Record<string, string> | null)?.[params.lang] ??
            (plan.name as Record<string, string> | null)?.en ??
            plan.code;

          return (
            <article key={plan.id} className="rounded-md border border-border/70 bg-white p-4 shadow-sm">
              <h2 className="font-semibold">{name}</h2>
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
      {!plans.length ? <p className="text-sm text-muted-foreground">暂无可用会员计划。</p> : null}
    </section>
  );
}
