"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useCart } from "@/providers/CartContext/CartContext";
import BookChild from "../BookChild/BookChild";

interface Book {
  _id: string;
  title: string;
  images: string[];
  price: number;
  newPrice: string;
}

const BookParent: React.FC = () => {
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
      images: book.images,
      price: book.newPrice ? Number(book.newPrice) : book.price,
      newPrice: book.newPrice ? Number(book.newPrice) : undefined,
    });
  };

  if (loading) {
    return (
      <Stack spacing={5}>
        <div className="flex flex-wrap gap-5 px-5 justify-center py-10">
          <Skeleton variant="rounded" width={350} height={550} />
          <Skeleton variant="rounded" width={350} height={550} />
          <Skeleton variant="rounded" width={350} height={550} />
        </div>
      </Stack>
    );
  }

  return (
    <Container>
      <div className="flex flex-wrap gap-5 justify-center items-center px-5 py-10">
        {books.map((book) => (
          <BookChild key={book._id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </Container>
  );
};

export default BookParent;
