"use client";

import { useCartStore } from "@/stores/cart-store";

interface CartSummaryProps {
  lang: string;
}

export function CartSummary({ lang }: CartSummaryProps) {
  const items = useCartStore((state) => state.items);
  const totalCents = useCartStore((state) => state.totalCents);

  const total = totalCents();
  const subtotal = total;
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const shipping = 500; // $5.00
  const finalTotal = subtotal + tax + shipping;

  const translations = {
    en: {
      subtotal: "Subtotal",
      tax: "Tax (10%)",
      shipping: "Shipping",
      total: "Total",
      items: "items",
    },
    "zh-CN": {
      subtotal: "小计",
      tax: "税费 (10%)",
      shipping: "运费",
      total: "总计",
      items: "件商品",
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
        <p className="text-center text-sm text-muted-foreground">
          {lang === "zh-CN" ? "购物车为空" : "Your cart is empty"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
      <h3 className="font-semibold">
        {items.length} {t.items}
      </h3>

      <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t.subtotal}</span>
          <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t.tax}</span>
          <span className="font-medium">${(tax / 100).toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t.shipping}</span>
          <span className="font-medium">${(shipping / 100).toFixed(2)}</span>
        </div>

        <div className="border-t border-border/50 pt-3 flex justify-between">
          <span className="font-semibold">{t.total}</span>
          <span className="text-lg font-bold text-primary">
            ${(finalTotal / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

