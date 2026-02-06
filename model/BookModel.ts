import { Schema, model, models, Document } from "mongoose";

export interface BookDocument extends Document {
  images?: string[];
  title: string;
  price: number;
  newPrice?: number;
}

const BookSchema = new Schema<BookDocument>(
  {
    title: {
      type: String,
    },
    images: {
      type: [String],
    },
    price: {
      type: Number,
      required: [true, "Enter book price"],
    },
    newPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

export const BookModel =
  models.BookModel || model<BookDocument>("BookModel", BookSchema);

export default BookModel;
