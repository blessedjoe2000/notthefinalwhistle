import { NextRequest } from "next/server";
import BookModel from "@/model/BookModel";
import { mongooseConnect } from "@/lib/connectDb";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  await mongooseConnect();

  const { id } = await params;

  try {
    const updateBook = await req.json();

    const updatedBook = await BookModel.findByIdAndUpdate(
      id,
      { $set: updateBook },
      { new: true },
    );

    if (!updatedBook) {
      return Response.json(
        { message: `No book with id ${id} found` },
        { status: 404 },
      );
    }

    return Response.json(updatedBook, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? `Error occurred updating a book: ${error.message}`
        : "Error occurred updating a book";

    return Response.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteParams,
): Promise<Response> {
  await mongooseConnect();

  const { id } = await params;

  try {
    const deleteBook = await BookModel.findByIdAndDelete(id);

    if (!deleteBook) {
      return Response.json(
        { message: `No book with id ${id} found` },
        { status: 404 },
      );
    }

    return Response.json(
      { message: `Book with id ${id} delete successfully` },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? `Error occurred deleting book: ${error.message}`
        : "Error occurred deleting book";

    return Response.json({ message }, { status: 500 });
  }
}
