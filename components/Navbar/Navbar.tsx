"use client";

import { useContext } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { CartContext } from "@/providers/CartContext/CartContext";
import Link from "next/link";
import { SignIn, SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const { isSignedIn } = useAuth();

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Navbar must be used within CartContextProvider");
  }

  const { cartBooks } = cartContext;

  return (
    <div className="py-5">
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
        <SignInButton>
          <button
            className="bg-[#00296b] px-3 py-1 mt-2 rounded-md text-white
               disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
};

export default Navbar;
