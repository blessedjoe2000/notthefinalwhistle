"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import axios from "axios";
import { useCart } from "@/providers/CartContext/CartContext";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/material";

interface Book {
  _id: string;
  title: string;
  imageUrl: string;
  price: number;
  newPrice: string;
}

const Book: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const { addBook } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<Book[]>("/api/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const addToCart = (book: Book) => {
    addBook({
      _id: book._id,
      title: book.title,
      imageUrl: book.imageUrl,
      price: book.newPrice ? Number(book.newPrice) : book.price,
      newPrice: book.newPrice ? Number(book.newPrice) : undefined,
    });
  };

  if (loading)
    return (
      <div>
        <Stack spacing={5}>
          <div className="flex flex-wrap gap-5 px-5 justify-center">
            <Skeleton variant="rounded" width={350} height={550} />
            <Skeleton variant="rounded" width={350} height={550} />
            <Skeleton variant="rounded" width={350} height={550} />
          </div>
        </Stack>
      </div>
    );

  return (
    <Container>
      <div className="flex flex-wrap gap-5 justify-center items-center px-5 py-10">
        {books.map((book) => (
          <div key={book._id} className="relative">
            <Image
              src={book.imageUrl}
              alt={book.title}
              width={350}
              height={550}
              className="rounded-lg"
            />
            <p className="text-2xl text-bold text-[#00296b]">{book.title}</p>
            <div className="flex gap-4 items-center">
              <p className="text-lg text-bold">Price:</p>

              {/* Old price */}
              <p
                className={`text-lg font-bold ${
                  book.newPrice ? "line-through text-gray-400" : ""
                }`}
              >
                ${book.price}
              </p>

              {/* New price (only show if it exists) */}
              {book.newPrice && (
                <p className="text-lg font-bold text-red-500">
                  ${book.newPrice}
                </p>
              )}
            </div>

            <div className="absolute top-2 right-6">
              <button
                onClick={() => addToCart(book)}
                className="bg-[#00296b] px-4 py-2 rounded-md text-white flex items-center gap-1 hover:text-[#faf0ca] cursor-pointer "
              >
                <ShoppingCartOutlinedIcon fontSize="small" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Book;
