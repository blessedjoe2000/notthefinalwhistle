"use client";

import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { AlignLeft } from "lucide-react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useContext, useRef } from "react";
import { CartContext } from "@/providers/CartContext/CartContext";

const MobileMenu = () => {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Navbar must be used within CartContextProvider");
  }

  const { cartBooks } = cartContext;

  // ✅ Create a ref for the Sheet
  const sheetRef = useRef<HTMLDivElement>(null);

  const isAdmin = Boolean(user?.publicMetadata?.isAdmin);

  return (
    <div className="flex justify-between items-center gap-2">
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <AlignLeft className="text-white hover:text-[#faf0ca]" />
          </SheetTrigger>
          <SheetContent side="left" ref={sheetRef}>
            <div className="flex flex-col gap-5 justify-around items-center py-2 mt-12 border-t-2 border-[#00296b]">
              <div className="flex flex-col justify-center items-center gap-5 my-5">
                <div>
                  <Link href="/">
                    <SheetClose className="flex items-center hover:text-[#faf0ca]! text-white py-1 px-2 rounded-md">
                      <ShoppingBagOutlinedIcon fontSize="small" />
                      Shop
                    </SheetClose>
                  </Link>
                </div>

                <div>
                  {isLoaded && isAdmin && (
                    <div>
                      <Link href="/admin/orders">
                        <SheetClose className="flex items-center hover:text-[#faf0ca]! text-white py-1 px-2 rounded-md">
                          Orders
                        </SheetClose>
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <Link href="/contact">
                    <SheetClose className="flex items-center hover:text-[#faf0ca]! text-white py-1 px-2 rounded-md">
                      Contact Us
                    </SheetClose>
                  </Link>
                </div>

                <div>
                  <Link href="/cart">
                    <SheetClose className="flex items-center hover:text-[#faf0ca]! text-[#00296b] py-1 px-2 rounded-md bg-white!">
                      <div className="relative">
                        <div className="absolute font-bold text-lg bottom-5 left-3">
                          <span>{cartBooks.length}</span>
                        </div>
                        <ShoppingCartOutlinedIcon fontSize="large" />
                      </div>
                    </SheetClose>
                  </Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div>
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

export default MobileMenu;
