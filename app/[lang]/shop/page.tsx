import Link from "next/link";
import { ProductGrid } from "@/components/shop/product-grid";

export default function ShopPage({ params }: { params: { lang: string } }) {
  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pet Shop</h1>
        <Link
          href={`/${params.lang}/cart`}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition"
        >
          {params.lang === "zh-CN" ? "购物车" : "Cart"}
        </Link>
      </div>

      <div
        className="relative overflow-hidden rounded-md border border-border/70 px-6 py-10 text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,16,12,0.74), rgba(20,16,12,0.28)), url('/images/shop-cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-2xl font-semibold">
          {params.lang === "zh-CN" ? "宠物用品" : "Pet Supplies"}
        </h2>
        <p className="mt-2 text-sm text-white/85">
          {params.lang === "zh-CN"
            ? "从宠粮到日常护理用品，统一下单与支付。"
            : "Everything your pet needs, from food to accessories."}
        </p>
      </div>
      <ProductGrid lang={params.lang} />
    </section>
  );
}
