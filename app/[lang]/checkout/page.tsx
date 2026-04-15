"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutForm, type CheckoutData } from "@/components/shop/checkout-form";
import { CartSummary } from "@/components/shop/cart-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totalCents = useCartStore((state) => state.totalCents);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const translations = {
    en: {
      title: "Checkout",
      emptyCart: "Your cart is empty",
      backToCart: "Back to Cart",
      error: "An error occurred. Please try again.",
    },
    "zh-CN": {
      title: "结账",
      emptyCart: "购物车为空",
      backToCart: "返回购物车",
      error: "发生错误，请重试。",
    },
  };

  const t = translations[params.lang as keyof typeof translations] || translations.en;

  if (items.length === 0) {
    return (
      <section className="grid gap-6">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/70 bg-white py-12 shadow-sm">
          <p className="text-muted-foreground">{t.emptyCart}</p>
          <Link href={`/${params.lang}/cart`}>
            <Button>{t.backToCart}</Button>
          </Link>
        </div>
      </section>
    );
  }

  const handleCheckout = async (formData: CheckoutData) => {
    setIsLoading(true);
    setError("");

    try {
      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCents: item.priceCents,
          })),
          totalCents: totalCents() + 600, // Add tax + shipping
          email: formData.email,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, totalCents: orderTotal } = await orderResponse.json();

      // Process payment based on method
      if (formData.paymentMethod === "stripe") {
        const intentResponse = await fetch("/api/payments/stripe-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: orderTotal,
            currency: "usd",
          }),
        });

        if (!intentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret } = await intentResponse.json();

        // Clear cart and redirect to payment
        clearCart();
        router.push(
          `/${params.lang}/payment/stripe?clientSecret=${clientSecret}&orderId=${orderId}`
        );
      } else if (formData.paymentMethod === "paypal") {
        const orderRes = await fetch("/api/payments/paypal-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: (orderTotal / 100).toFixed(2),
            currency: "USD",
          }),
        });

        if (!orderRes.ok) {
          throw new Error("Failed to create PayPal order");
        }

        const paypalOrder = await orderRes.json();

        // Clear cart and redirect to payment
        clearCart();
        router.push(
          `/${params.lang}/payment/paypal?orderId=${paypalOrder.id}&petnexusOrderId=${orderId}`
        );
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : t.error);
      setIsLoading(false);
    }
  };

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">{t.title}</h1>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm
            lang={params.lang}
            onCheckout={handleCheckout}
            isLoading={isLoading}
          />
        </div>

        <div className="flex flex-col gap-4">
          <CartSummary lang={params.lang} />
          <Link href={`/${params.lang}/cart`}>
            <Button variant="outline" className="w-full">
              {t.backToCart}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

