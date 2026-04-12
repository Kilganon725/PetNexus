import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
});

export async function POST(request: Request) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const payload = schema.parse(await request.json());

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 500 });
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "PayPal token failed" }, { status: 500 });
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string };

  const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: payload.currency,
            value: payload.amount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!orderResponse.ok) {
    return NextResponse.json({ error: "PayPal order failed" }, { status: 500 });
  }

  const orderData = (await orderResponse.json()) as { id: string; status: string };
  return NextResponse.json(orderData);
}
