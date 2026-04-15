"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function StripePaymentContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");
  const orderId = searchParams.get("orderId");
  const [options, setOptions] = useState<{ clientSecret: string } | null>(null);

  useEffect(() => {
    if (clientSecret) {
      setOptions({ clientSecret });
    }
  }, [clientSecret]);

  if (!options) {
    return <div>Loading...</div>;
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

export default function StripePaymentPage() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Payment</h1>
      <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
        <Suspense fallback={<div>Loading payment form...</div>}>
          <StripePaymentContent />
        </Suspense>
      </div>
    </section>
  );
}

