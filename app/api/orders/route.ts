import { NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/connectDb";
import OrderModel, { OrderDocument } from "@/model/OrderModel";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest): Promise<Response> {
  await mongooseConnect();

  try {
    const allOrders: OrderDocument[] = await OrderModel.find().sort({
      updatedAt: -1,
    });

    return Response.json(allOrders, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Error occurred creating new book: ${error.message}`
        : "Error occurred creating new book";

    return Response.json({ message }, { status: 500 });
  }
}
