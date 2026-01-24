"use client";

import Image from "next/image";
import React from "react";
import book from "@/public/IMG_0089.jpg";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { CartContext } from "@/providers/CartContext/CartContext";

const Book: React.FC = () => {
  const { addBook } = CartContext;

  const addToCart = () => {
    addBook(book);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Image
          src={book}
          alt="book"
          width={400}
          height={600}
          className="rounded-lg"
        />

        {/* Overlay */}
        <div className="absolute top-2 right-2 text-white rounded">
          <button
            onClick={addToCart}
            className="bg-[#00296b] px-4 py-2 rounded-md cursor-pointer flex justify-center items-center hover:text-[#faf0ca]"
          >
            <ShoppingCartOutlinedIcon fontSize="small" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book;
