"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { CartItems } from "@/components/shop/cart-items";
import { CartSummary } from "@/components/shop/cart-summary";
import { Button } from "@/components/ui/button";

export default function CartPage({ params }: { params: { lang: string } }) {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const translations = {
    en: {
      title: "Shopping Cart",
      emptyCart: "Your cart is empty",
      continueShopping: "Continue Shopping",
      clearCart: "Clear Cart",
      checkout: "Proceed to Checkout",
      confirm: "Are you sure? This cannot be undone.",
    },
    "zh-CN": {
      title: "购物车",
      emptyCart: "购物车为空",
      continueShopping: "继续购物",
      clearCart: "清空购物车",
      checkout: "结账",
      confirm: "确定要清空吗？此操作无法撤销。",
    },
  };

  const t = translations[params.lang as keyof typeof translations] || translations.en;

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        {items.length > 0 && (
          <div className="flex gap-2">
            {!showClearConfirm ? (
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(true)}
              >
                {t.clearCart}
              </Button>
            ) : (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                >
                  {t.confirm}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                >
                  {params.lang === "zh-CN" ? "取消" : "Cancel"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/70 bg-white py-12 shadow-sm">
          <p className="text-muted-foreground">{t.emptyCart}</p>
          <Link href={`/${params.lang}/shop`}>
            <Button>{t.continueShopping}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CartItems lang={params.lang} />
          </div>

          <div className="flex flex-col gap-4">
            <CartSummary lang={params.lang} />
            <div className="flex flex-col gap-2">
              <Link href={`/${params.lang}/checkout`}>
                <Button className="w-full" size="lg">
                  {t.checkout}
                </Button>
              </Link>
              <Link href={`/${params.lang}/shop`}>
                <Button variant="outline" className="w-full">
                  {t.continueShopping}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

