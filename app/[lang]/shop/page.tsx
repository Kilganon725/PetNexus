import { ProductGrid } from "@/components/shop/product-grid";

export default function ShopPage({ params }: { params: { lang: string } }) {
  return (
    <section className="grid gap-6">
      <div
        className="relative overflow-hidden rounded-md border border-border/70 px-6 py-10 text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,16,12,0.74), rgba(20,16,12,0.28)), url('/images/shop-cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl font-semibold">Pet Shop</h1>
        <p className="mt-2 text-sm text-white/85">从宠粮到日常护理用品，统一下单与支付。</p>
        <button className="mt-4 rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground">
          查看热销商品
        </button>
      </div>
      <ProductGrid lang={params.lang} />
    </section>
  );
}
