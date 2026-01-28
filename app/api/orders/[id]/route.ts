import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { mongooseConnect } from "@/lib/connectDb";
import OrderModel from "@/model/OrderModel";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();

  const { id } = await context.params;

  const { orderStatus }: { orderStatus: string } = await req.json();

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

    const order = await OrderModel.findById(id);

    if (!order) {
      return new Response(JSON.stringify({ message: "order not found" }), {
        status: 404,
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { $set: { status: orderStatus } },
      { new: true },
    );

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();

  const { id } = await context.params;

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

    const order = await OrderModel.findById(id);

    if (!order) {
      return new Response(JSON.stringify({ message: "order not found" }), {
        status: 404,
      });
    }
    // Attempt to delete and return the deleted document
    await OrderModel.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: `order with id ${id} deleted successfully` }),
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}
