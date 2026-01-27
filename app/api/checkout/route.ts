export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { mongooseConnect } from "@/lib/connectDb";
import OrderModel from "@/model/OrderModel";

const stripe = new Stripe(process.env.STRIPE_SK as string);

interface CartBook {
  title: string;
  price: number;
  newPrice?: number;
  images?: string[];
  imageurl?: string;
}

interface CheckoutRequestBody {
  name: string;
  email: string;
  phone: string;
  cartBooks: CartBook[];
}

export async function POST(req: Request): Promise<Response> {
  await mongooseConnect();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, phone, cartBooks }: CheckoutRequestBody =
      await req.json();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const cartBook of cartBooks) {
      const bookPrice = (cartBook.newPrice ?? cartBook.price) * 100;

      line_items.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          tax_behavior: "exclusive",
          unit_amount: bookPrice,
          product_data: {
            name: cartBook.title,
            images: cartBook.images,
          },
        },
      });
    }

    const orderInfo = await OrderModel.create({
      line_items,
      name,
      email,
      phone,
      status: "Not paid",
      address: {
        city: "",
        country: "",
        line1: "",
        line2: "",
        postal_code: "",
        state: "",
      },
      orderProducts: cartBooks.map((cartBook) => ({
        title: cartBook.title,
        imageUrl: cartBook?.imageurl,
        price: cartBook.newPrice ?? cartBook.price,
        quantity: 1,
      })),
      paid: false,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,

      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Pick up",
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 499, currency: "usd" },
            display_name: "Standard",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],

      automatic_tax: { enabled: true },
      line_items,

      success_url: `${process.env.NEXTAUTH_URL}/cart?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=true`,

      metadata: {
        orderId: orderInfo._id.toString(),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";

    return new Response(JSON.stringify(message), { status: 500 });
  }
}
