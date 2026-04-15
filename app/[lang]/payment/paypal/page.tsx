"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/paypal-js";

function PayPalPaymentContent() {
  const searchParams = useSearchParams();
  const paypalOrderId = searchParams.get("orderId");
  const petnexusOrderId = searchParams.get("petnexusOrderId");
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div className="rounded-lg border border-border/70 bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <PayPalButtons
        createOrder={() => Promise.resolve(paypalOrderId || "")}
        onApprove={async (data) => {
          try {
            // In production, capture the PayPal order on the server
            // For now, just redirect to success
            router.push(
              `/en/order-confirmation?orderId=${petnexusOrderId}&paypalOrderId=${paypalOrderId}`
            );
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed");
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          setError("An error occurred with PayPal. Please try again.");
        }}
      />
    </div>
  );
}

export default function PayPalPaymentPage() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">PayPal Payment</h1>
      <Suspense fallback={<div>Loading PayPal...</div>}>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
          }}
        >
          <PayPalPaymentContent />
        </PayPalScriptProvider>
      </Suspense>
    </section>
  );
}

