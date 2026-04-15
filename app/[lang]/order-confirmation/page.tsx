"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function OrderConfirmationContent({ lang }: { lang: string }) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) throw new Error("No order ID provided");

        const response = await fetch(`/api/orders?orderId=${orderId}`);
        if (!response.ok) throw new Error("Failed to fetch order");

        const { data } = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const translations = {
    en: {
      success: "Order Confirmed!",
      successMessage: "Your order has been placed successfully.",
      orderId: "Order ID",
      total: "Total",
      status: "Status",
      items: "Items",
      continueShopping: "Continue Shopping",
      backToHome: "Back to Home",
      loading: "Loading your order...",
      error: "Unable to load order details",
    },
    "zh-CN": {
      success: "订单已确认!",
      successMessage: "您的订单已成功下单。",
      orderId: "订单ID",
      total: "总计",
      status: "状态",
      items: "商品",
      continueShopping: "继续购物",
      backToHome: "返回首页",
      loading: "加载订单中...",
      error: "无法加载订单详情",
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  if (loading) {
    return <p>{t.loading}</p>;
  }

  if (error || !order) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error || t.error}
      </div>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex items-center gap-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold">{t.success}</h1>
          <p className="mt-1 text-muted-foreground">{t.successMessage}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">{t.orderId}</p>
            <p className="font-mono font-semibold">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.total}</p>
            <p className="text-2xl font-bold text-primary">
              ${(order.totalCents / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">{t.items}</h3>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{item.product?.name?.en || "Product"}</p>
                  <p className="text-sm text-muted-foreground">
                    {lang === "zh-CN" ? "数量" : "Qty"}: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.unitCents * item.quantity / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/${lang}/shop`}>
          <Button variant="outline" className="flex-1">
            {t.continueShopping}
          </Button>
        </Link>
        <Link href={`/${lang}`}>
          <Button className="flex-1">
            {t.backToHome}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function OrderConfirmationPage({ params }: { params: { lang: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent lang={params.lang} />
    </Suspense>
  );
}

