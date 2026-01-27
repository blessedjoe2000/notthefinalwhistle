import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { mongooseConnect } from "@/lib/connectDb";
import OrderModel from "@/model/OrderModel";

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await mongooseConnect();

  const { id } = await params;

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
