"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  lang: string;
  onCheckout: (data: CheckoutData) => Promise<void>;
  isLoading?: boolean;
}

export interface CheckoutData {
  email: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: "stripe" | "paypal";
}

export function CheckoutForm({ lang, onCheckout, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "stripe",
  });

  const items = useCartStore((state) => state.items);

  const translations = {
    en: {
      shipping: "Shipping Information",
      email: "Email",
      fullName: "Full Name",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      country: "Country",
      paymentMethod: "Payment Method",
      stripe: "Credit Card (Stripe)",
      paypal: "PayPal",
      checkout: "Proceed to Payment",
      emptyCart: "Please add items to cart first",
      invalidForm: "Please fill in all fields",
    },
    "zh-CN": {
      shipping: "收货地址",
      email: "邮箱",
      fullName: "姓名",
      address: "地址",
      city: "城市",
      postalCode: "邮编",
      country: "国家",
      paymentMethod: "支付方式",
      stripe: "信用卡 (Stripe)",
      paypal: "PayPal",
      checkout: "进行支付",
      emptyCart: "请先添加商品到购物车",
      invalidForm: "请填写所有字段",
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert(t.emptyCart);
      return;
    }

    if (
      !formData.email ||
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.country
    ) {
      alert(t.invalidForm);
      return;
    }

    await onCheckout(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold">{t.shipping}</h3>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">{t.email}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.fullName}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.address}</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded border border-input bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t.city}</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.postalCode}</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full rounded border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.country}</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full rounded border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold">{t.paymentMethod}</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={formData.paymentMethod === "stripe"}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value as "stripe" | "paypal" })
              }
              className="h-4 w-4"
            />
            <span className="text-sm">{t.stripe}</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={formData.paymentMethod === "paypal"}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value as "stripe" | "paypal" })
              }
              className="h-4 w-4"
            />
            <span className="text-sm">{t.paypal}</span>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || items.length === 0}
        className="w-full"
        size="lg"
      >
        {isLoading ? (lang === "zh-CN" ? "处理中..." : "Processing...") : t.checkout}
      </Button>
    </form>
  );
}

