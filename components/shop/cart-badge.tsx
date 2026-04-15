"use client";

import { useCartStore } from "@/stores/cart-store";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function CartBadge({ lang }: { lang: string }) {
  const itemCount = useCartStore((state) => state.itemCount);
  const count = itemCount();

  return (
    <Link
      href={`/${lang}/cart`}
      className="relative inline-flex items-center justify-center rounded-lg p-2 hover:bg-accent transition"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

