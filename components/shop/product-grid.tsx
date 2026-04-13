"use client";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

type Product = {
  id: string;
  priceCents: number;
  currency: string;
  name: Record<string, string>;
};

async function fetchProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Failed to fetch products");
  return (await response.json()) as { data: Product[] };
}

export function ProductGrid({ lang }: { lang: string }) {
  const addItem = useCartStore((state) => state.addItem);
  const totalCents = useCartStore((state) => state.totalCents);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between rounded-md border border-border/70 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm font-medium">Cart total</p>
        <p className="text-sm font-semibold text-primary">${(totalCents() / 100).toFixed(2)}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {data?.data.map((product) => (
          <article key={product.id} className="rounded-md border border-border/70 bg-white p-4 shadow-sm">
            <h2 className="font-semibold">{product.name?.[lang] ?? product.name?.en ?? "Product"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {(product.priceCents / 100).toFixed(2)} {product.currency}
            </p>
            <Button
              className="mt-3 w-full"
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name?.[lang] ?? product.name?.en ?? "Product",
                  priceCents: product.priceCents,
                })
              }
            >
              Add to cart
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
