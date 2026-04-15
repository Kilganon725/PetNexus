import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      unitCents: z.number().int().positive(),
    })
  ).min(1),
  totalCents: z.number().int().positive(),
  email: z.string().email(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  paymentMethod: z.enum(["stripe", "paypal"]),
});

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const payload = createOrderSchema.parse(body);

    // For now, create order without user association (guest checkout)
    // In production, you might want to associate with authenticated user
    const order = await prisma.order.create({
      data: {
        userId: "", // Can be connected to actual user if authenticated
        totalCents: payload.totalCents,
        status: "PENDING",
        items: {
          create: payload.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCents: item.unitCents,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Store checkout info temporarily (in production, use proper storage)
    // For now, return the order ID for payment processing
    return NextResponse.json(
      {
        orderId: order.id,
        totalCents: order.totalCents,
        items: order.items,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "orderId parameter is required" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

