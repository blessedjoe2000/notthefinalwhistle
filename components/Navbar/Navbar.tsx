"use client";

import { useContext } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { CartContext } from "@/providers/CartContext/CartContext";

const Navbar: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Navbar must be used within CartContextProvider");
  }

  const { cartBooks } = cartContext;

  return (
    <div className="py-5">
      <div className="relative">
        <div className="absolute font-bold text-lg bottom-5 left-3">
          <span className="">{cartBooks.length}</span>
        </div>
        <ShoppingCartOutlinedIcon fontSize="large" />
      </div>
    </div>
  );
};

export default Navbar;
