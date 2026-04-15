"use client";

import { Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";

interface CartItemsProps {
  lang: string;
}

export function CartItems({ lang }: CartItemsProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);

  const translations = {
    en: {
      quantity: "Quantity",
      price: "Price",
      total: "Total",
      remove: "Remove",
    },
    "zh-CN": {
      quantity: "数量",
      price: "价格",
      total: "总价",
      remove: "删除",
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          {lang === "zh-CN" ? "购物车为空" : "Your cart is empty"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.productId}
          className="rounded-lg border border-border/70 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                ${(item.priceCents / 100).toFixed(2)} {lang === "zh-CN" ? "每件" : "each"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-4 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.productId)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    addItem({ productId: item.productId, name: item.name, priceCents: item.priceCents }, -1)
                  }
                  disabled={item.quantity <= 1}
                >
                  −
                </Button>
                <span className="w-8 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    addItem({ productId: item.productId, name: item.name, priceCents: item.priceCents }, 1)
                  }
                >
                  +
                </Button>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase">{t.total}</p>
                <p className="font-bold">
                  ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

