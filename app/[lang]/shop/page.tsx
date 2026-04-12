import { ProductGrid } from "@/components/shop/product-grid";

export default function ShopPage({ params }: { params: { lang: string } }) {
  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Pet Shop</h1>
      <ProductGrid lang={params.lang} />
    </section>
  );
}
