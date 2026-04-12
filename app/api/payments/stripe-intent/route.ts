import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const schema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().default("usd"),
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const intent = await stripe.paymentIntents.create({
    amount: payload.amount,
    currency: payload.currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}
