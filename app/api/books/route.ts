import { NextRequest } from "next/server";
import BookModel, { BookDocument } from "@/model/BookModel";
import { mongooseConnect } from "@/lib/connectDb";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest): Promise<Response> {
  await mongooseConnect();

  try {
    const allBooks: BookDocument[] = await BookModel.find().sort({
      updatedAt: -1,
    });

    return Response.json(allBooks, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Error occurred creating new book: ${error.message}`
        : "Error occurred creating new book";

    return Response.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  await mongooseConnect();

  const { title, images, price, newPrice } = await req.json();

  try {
    const newBook: BookDocument[] = await BookModel.create({
      title,
      images,
      price,
      newPrice,
    });

    return Response.json(newBook, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Error occurred creating new book: ${error.message}`
        : "Error occurred creating new book";

    return Response.json({ message }, { status: 500 });
  }
}
