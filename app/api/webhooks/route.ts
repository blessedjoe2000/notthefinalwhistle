export const runtime = "nodejs";

import Stripe from "stripe";
import OrderModel from "@/model/OrderModel";
import { transporter } from "@/lib/mailer";
import { mongooseConnect } from "@/lib/connectDb";

const stripe = new Stripe(process.env.STRIPE_SK as string);

export async function POST(req: Request): Promise<Response> {
  await mongooseConnect();

  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const { payment_status, metadata, customer_details, amount_total } =
        session;

      const orderId = metadata?.orderId;
      const address = customer_details?.address;

      if (payment_status === "paid" && orderId) {
        await OrderModel.findByIdAndUpdate(
          orderId,
          {
            paid: true,
            address,
            status: "Pending",
          },
          { new: true },
        );

        await transporter.sendMail({
          from: {
            name: "Not The Final Whistle",
            address: process.env.ADMIN_EMAIL as string,
          },
          to: [
            process.env.ADMIN_NOTIFY_EMAIL as string,
            process.env.ORG_EMAIL as string,
          ],
          subject: "🛒 New Purchase Alert",
          html: `
            <h2>New Order Received</h2>
            <p><strong>Customer Name:</strong> ${customer_details?.name ?? "N/A"}</p>
            <p><strong>Email:</strong> ${customer_details?.email ?? "N/A"}</p>
            <p><strong>Address:</strong>
              ${address?.line1 ?? ""} ${address?.city ?? ""} ${
                address?.state ?? ""
              } ${address?.postal_code ?? ""}
            </p>
            <p><strong>Total:</strong> $${(amount_total ?? 0) / 100}</p>
            <p><strong>Status:</strong> ${payment_status}</p>
          `,
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response("successful payment", { status: 200 });
}
