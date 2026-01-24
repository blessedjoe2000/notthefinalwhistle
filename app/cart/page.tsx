"use client";

import { useContext, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { CartContext } from "@/providers/CartContext/CartContext";
import type { CartBook } from "@/providers/CartContext/CartContext";

/**
 * Cart-specific product shape
 */
interface CartPageBook extends CartBook {
  _id: string;
  price: number;
  newPrice?: number;
  images?: string[];
}

export default function Cart() {
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error("Cart must be used within CartContextProvider");
  }

  const { cartBooks, reduceBook, clearCart } = cartContext;

  console.log("cartBooks :>> ", cartBooks);

  const isCartEmpty = cartBooks.length === 0;

  const isSuccess =
    typeof window !== "undefined" && window.location.href.includes("success");

  /**
   * Clear cart ONCE after successful payment
   */
  const hasClearedOnSuccess = useRef(false);

  useEffect(() => {
    if (!isSuccess || hasClearedOnSuccess.current) return;

    hasClearedOnSuccess.current = true;
    clearCart();
  }, [isSuccess, clearCart]);

  /**
   * Total price calculation
   */
  const total = useMemo(() => {
    return cartBooks.reduce((sum, product) => {
      const item = product as CartPageBook;
      return sum + (item.newPrice ?? item.price);
    }, 0);
  }, [cartBooks]);

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

  /**
   * Success screen
   */
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
        <div className="grid sm:grid-cols-2 gap-2 text-white">
          {/* Cart items */}
          <div className="bg-dark-blue lg:px-10 md:px-2 rounded-md">
            {cartBooks.map((product, index) => {
              const item = product as CartPageBook;

              return (
                <div key={index}>
                  <div className="flex gap-2 sm:p-5 p-2">
                    <Link href={`/product/${item._id}`}>
                      <Image
                        src={item.images?.[0] ?? "/placeholder.png"}
                        alt="product"
                        width={150}
                        height={200}
                        className="object-cover rounded-md"
                      />
                    </Link>

                    <div>
                      <p className="font-bold text-sharp-pink">
                        ${item.newPrice ?? item.price}
                      </p>

                      <button
                        onClick={() => reduceBook(product)}
                        className="flex items-center bg-sharp-pink px-2 mt-2 rounded-md"
                      >
                        <CloseIcon fontSize="small" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <Divider />
                </div>
              );
            })}

            <div className="flex gap-2 py-2 px-5 text-lg font-bold">
              <p>Sub-total:</p>
              <p className="text-xl text-sharp-pink">${total}</p>
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

              <p className="text-sm text-sharp-pink pt-1">
                *login to continue*
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
