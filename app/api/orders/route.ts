import { NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/connectDb";
import OrderModel, { OrderDocument } from "@/model/OrderModel";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest): Promise<Response> {
  await mongooseConnect();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (user.publicMetadata?.isAdmin !== true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allOrders: OrderDocument[] = await OrderModel.find().sort({
      createdAt: -1,
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
