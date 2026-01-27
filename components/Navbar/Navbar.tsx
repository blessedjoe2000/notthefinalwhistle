"use client";

import { useContext } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { CartContext } from "@/providers/CartContext/CartContext";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const Navbar: React.FC = () => {
  const { isSignedIn } = useAuth();

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Navbar must be used within CartContextProvider");
  }

  const { cartBooks } = cartContext;

  return (
    <div className="py-5 bg-[#00296b] flex justify-between items-center text-white px-20">
      <div>
        <Link href="/" className=" flex items-center">
          <ShoppingBagOutlinedIcon fontSize="small" />
          Shop
        </Link>
      </div>
      <div className="flex gap-10 items-center">
        <Link href="/cart">
          <div className="relative">
            <div className="absolute font-bold text-lg bottom-5 left-3">
              <span className="">{cartBooks.length}</span>
            </div>
            <ShoppingCartOutlinedIcon fontSize="large" />
          </div>
        </Link>

        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            <button className="bg-[#faf0ca]! px-3 py-1 mt-2 rounded-md text-[#00296b]! hover:bg-white!">
              Sign in
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
