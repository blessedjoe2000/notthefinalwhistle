"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import { useCart } from "@/providers/CartContext/CartContext";
import type { CartBook } from "@/providers/CartContext/CartContext";

/**
 * Cart-specific product shape
 */
interface CartPageBook extends CartBook {
  _id: string;
  title: string;
  imageUrl?: string;
  price: number;
  newPrice?: number;
}

export default function Cart() {
  //   const cartContext = useContext(CartContext);
  //   if (!cartContext) {
  //     throw new Error("Cart must be used within CartContextProvider");
  //   }

  const { cartBooks, reduceBook, clearCart, addBook } = useCart();

  const isCartEmpty = cartBooks.length === 0;

  const isSuccess =
    typeof window !== "undefined" && window.location.href.includes("success");

  const hasClearedOnSuccess = useRef(false);

  useEffect(() => {
    if (!isSuccess || hasClearedOnSuccess.current) return;

    hasClearedOnSuccess.current = true;
    clearCart();
  }, [isSuccess, clearCart]);

  const groupedCartBooks = useMemo(() => {
    const map = new Map<string, CartPageBook & { quantity: number }>();

    cartBooks.forEach((book) => {
      const existing = map.get(book._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        map.set(book._id, { ...book, quantity: 1 });
      }
    });

    return Array.from(map.values());
  }, [cartBooks]);

  console.log("groupedCartBooks :>> ", groupedCartBooks);

  // Total price calculation
  const total = useMemo(() => {
    return groupedCartBooks.reduce((sum, book) => {
      const price = book.newPrice ?? book.price;
      return sum + price * book.quantity;
    }, 0);
  }, [groupedCartBooks]);

  /**
   * Checkout handler
   */
  const handleGoToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await axios.post<{ url?: string }>("/api/checkout", {
      cartBooks,
    });

    if (response.data.url) {
      window.location.href = response.data.url;
    }
  };

  //Success screen
  if (isSuccess) {
    return (
      <div className="bg-dark-blue mx-5 text-center py-10 text-white">
        <h1 className="font-bold py-2 text-lg">
          Payment Successful! Thank you for shopping with us.
        </h1>
        <p className="mb-5">We will email you when your order is sent.</p>

        <Link
          href="/"
          className="bg-dark-green rounded-md inline-flex items-center gap-2 px-3 py-1 hover:text-light-green"
        >
          <p className="text-lg">Go to shop</p>
        </Link>
      </div>
    );
  }

  /**
   * Main cart UI
   */
  return (
    <div className="m-5">
      <div className="text-lg font-bold mb-2">Shopping Cart</div>

      {isCartEmpty ? (
        <div>Your Cart is empty</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2">
          <div className="bg-dark-blue lg:px-10 md:px-2 rounded-md">
            {groupedCartBooks?.map((book) => {
              return (
                <div key={book?._id}>
                  <div className="flex gap-2 sm:p-5 p-2">
                    <Image
                      src={book?.imageUrl}
                      alt={book?.title}
                      width={150}
                      height={200}
                      className="object-cover rounded-md"
                    />
                    <div>
                      <div className="flex gap-2 text-[#00296b]">
                        <p className="font-bold text-lg">{book.title}</p>
                        <span className="bg-light-green text-dark-blue text-sm font-bold px-2 py-0.5 rounded-full">
                          x{book.quantity}
                        </span>
                      </div>
                      <p className="font-bold text-lg text-[#00296b] ">
                        ${book.newPrice ?? book.price}
                      </p>

                      <button
                        onClick={() => addBook(book)}
                        className="flex items-center mt-2 rounded-md bg-[#00296b] py-1 px-2 text-white"
                      >
                        <AddCircleOutlinedIcon fontSize="small" />
                        Add
                      </button>
                      <button
                        onClick={() => reduceBook(book)}
                        className="flex items-center mt-2 rounded-md bg-[#00296b] py-1 px-2 text-white"
                      >
                        <DoNotDisturbOnIcon fontSize="small" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <Divider />
                </div>
              );
            })}

            <div className="flex gap-2 py-2 px-5 text-lg font-bold text-[#00296b]">
              <p>Sub-total:</p>
              <p className="text-2xl ">${total}</p>
            </div>
          </div>

          {/* Order summary */}
          <div className="p-5 rounded-md bg-dark-blue">
            <h2 className="font-bold text-lg text-light-green">
              Order information
            </h2>

            <form onSubmit={handleGoToPayment}>
              <button
                type="submit"
                className="mt-2 px-3 py-1 rounded-md text-white disabled:bg-slate-300"
                disabled
              >
                Continue to payment
              </button>

              <p className="text-sm  pt-1">*login to continue*</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
