import Link from "next/link";

import { translate, getDictionary } from "@/lib/i18n";

export default async function DashboardPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);

  return (
    <section className="grid gap-6">
      <div
        className="relative overflow-hidden rounded-md border border-border/70 px-6 py-12 text-white md:px-8 md:py-16"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(6,24,20,0.8), rgba(6,24,20,0.3)), url('/images/hero-pets.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Smart Operations</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{translate(dictionary, "home.title")}</h2>
          <p className="mt-3 text-sm text-white/90 md:text-base">{translate(dictionary, "home.subtitle")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/${params.lang}/pets`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              进入宠物中心
            </Link>
            <Link href={`/${params.lang}/shop`} className="rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black">
              立即购物
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/${params.lang}/pets`}
          className="rounded-md border border-border/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-primary">{translate(dictionary, "nav.pets")}</p>
          <p className="mt-2 text-sm text-muted-foreground">电子档案、地理位置和健康数据集中管理。</p>
          <span className="mt-4 inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            查看详情
          </span>
        </Link>
        <Link
          href={`/${params.lang}/shop`}
          className="rounded-md border border-border/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-secondary">{translate(dictionary, "nav.shop")}</p>
          <p className="mt-2 text-sm text-muted-foreground">商品浏览、购物车和订单支付一体化。</p>
          <span className="mt-4 inline-flex rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
            去下单
          </span>
        </Link>
        <Link
          href={`/${params.lang}/designer`}
          className="rounded-md border border-border/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-accent">{translate(dictionary, "nav.designer")}</p>
          <p className="mt-2 text-sm text-muted-foreground">在线设计狗牌，上传图像并自动压缩处理。</p>
          <span className="mt-4 inline-flex rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            开始设计
          </span>
        </Link>
        <Link
          href={`/${params.lang}/membership`}
          className="rounded-md border border-border/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-foreground">{translate(dictionary, "nav.membership")}</p>
          <p className="mt-2 text-sm text-muted-foreground">多等级会员订阅，支持 Stripe 与 PayPal。</p>
          <span className="mt-4 inline-flex rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold">
            查看方案
          </span>
        </Link>
      </div>
    </section>
  );
}
