"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Divider } from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import { useCart } from "@/providers/CartContext/CartContext";
import type { CartBook } from "@/providers/CartContext/CartContext";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface CartPageBook extends CartBook {
  _id: string;
  title: string;
  imageUrl?: string;
  price: number;
  newPrice?: number;
}

export default function Cart() {
  const { isSignedIn } = useAuth();

  const { cartBooks, reduceBook, clearCart, addBook } = useCart();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Total price calculation
  const total = useMemo(() => {
    return groupedCartBooks.reduce((sum, book) => {
      const price = book.newPrice ?? book.price;
      return sum + price * book.quantity;
    }, 0);
  }, [groupedCartBooks]);

  //Checkout handler
  const handleGoToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      return toast.error("Name is required. Please enter name", {
        style: {
          border: "1px solid #00296b",
          padding: "16px",
          color: "#00296b",
        },
        iconTheme: {
          primary: "#00296b",
          secondary: "#faf0ca",
        },
      });
    }
    if (!email) {
      return toast.error("Email is required. Please enter email", {
        style: {
          border: "1px solid #00296b",
          padding: "16px",
          color: "#00296b",
        },
        iconTheme: {
          primary: "#00296b",
          secondary: "#faf0ca",
        },
      });
    }
    if (!phone) {
      return toast.error("Mobile no is required. Please enter mobile", {
        style: {
          border: "1px solid #00296b",
          padding: "16px",
          color: "#00296b",
        },
        iconTheme: {
          primary: "#00296b",
          secondary: "#faf0ca",
        },
      });
    }

    setIsLoading(true);
    const response = await axios.post<{ url?: string }>("/api/checkout", {
      name,
      email,
      phone,
      cartBooks,
    });

    if (response.data.url) {
      window.location.href = response.data.url;
    }
    setIsLoading(false);
  };

  //Success screen
  if (isSuccess) {
    return (
      <div className="bg-dark-blue mx-5 text-center py-10 ">
        <h1 className="font-bold py-2 text-lg">
          Payment Successful! Thank you for shopping with us.
        </h1>
        <p className="mb-5">We will email you when your order is sent.</p>

        <Link href="/">
          <button className="text-lg px-3 py-1 mt-2 rounded-md text-white text-center">
            Go to shop
          </button>
        </Link>
      </div>
    );
  }

  //Main cart UI
  return (
    <div className="m-5">
      <div className="text-2xl font-bold mb-5 text-[#00296b] text-center">
        Your Shopping Cart
      </div>

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
                      src={book.imageUrl ?? "/placeholder-book.png"}
                      alt={book?.title}
                      width={120}
                      height={150}
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
                        className="flex items-center mt-2 rounded-md py-1 px-2 text-white"
                      >
                        <AddCircleOutlinedIcon fontSize="small" />
                        Add
                      </button>
                      <button
                        onClick={() => reduceBook(book)}
                        className="flex items-center mt-2 rounded-md py-1 px-2 text-white"
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
          <div className="p-5 rounded-md bg-dark-blue text-[#00296b]">
            <p className="font-bold text-lg text-light-green">
              Order information
            </p>

            <form onSubmit={handleGoToPayment}>
              <div>
                <label htmlFor="name">
                  Name:<span className="text-[#e71d36]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email">
                  Email:<span className="text-[#e71d36]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phone">
                  Phone Number:<span className="text-[#e71d36]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>

              <div>
                {!isSignedIn && (
                  <p className="text-sm pt-2 text-[#e71d36]">
                    *login to continue*
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={!isSignedIn}
                className="
   px-3 py-1 mt-2 rounded-md text-white text-center flex items-center gap-1
    disabled:bg-slate-300
    disabled:cursor-not-allowed
  "
              >
                {isLoading && <Loader2 className=" animate-spin" />}
                Continue to payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
