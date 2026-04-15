import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateOrderSchema = z.object({
  orderId: z.string(),
  status: z.enum(["PENDING", "PAID", "FULFILLED", "REFUNDED", "CANCELED"]),
  stripeIntentId: z.string().optional(),
  paypalOrderId: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const payload = updateOrderSchema.parse(body);

    const order = await prisma.order.update({
      where: { id: payload.orderId },
      data: {
        status: payload.status,
        stripeIntentId: payload.stripeIntentId,
        paypalOrderId: payload.paypalOrderId,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error("Order update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

