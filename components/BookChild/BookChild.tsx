"use client";

import React, { useState } from "react";
import Image from "next/image";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

interface Book {
  _id: string;
  title: string;
  images: string[];
  price: number;
  newPrice: string;
}

interface Props {
  book: Book;
  addToCart: (book: Book) => void;
}

const BookChild: React.FC<Props> = ({ book, addToCart }) => {
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((prev) => (prev === book.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      <Image
        src={book.images?.[activeImage]}
        alt={book.title}
        width={350}
        height={550}
        className="rounded-lg cursor-pointer"
        onClick={nextImage}
      />

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {book.images?.map((_, index) => (
          <span
            key={index}
            onClick={() => setActiveImage(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              index === activeImage ? "bg-[#00296b]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <p className="text-2xl font-bold text-[#00296b] mt-2">{book.title}</p>

      <div className="flex gap-4 items-center">
        <p className="text-lg font-bold">Price:</p>

        <p
          className={`text-lg font-bold ${
            book.newPrice ? "line-through text-gray-400" : ""
          }`}
        >
          ${book.price}
        </p>

        {book.newPrice && (
          <p className="text-lg font-bold text-red-500">${book.newPrice}</p>
        )}
      </div>

      <div className="absolute top-2 right-4">
        <button
          onClick={() => addToCart(book)}
          className="bg-[#00296b] px-4 py-2 rounded-md text-white flex items-center gap-1 hover:text-[#faf0ca]"
        >
          <ShoppingCartOutlinedIcon fontSize="small" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookChild;
