"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

export interface CartBook {
  id: string;
  images?: string[];
  price: number;
  newPrice?: number;
}

interface CartContextType {
  cartBooks: CartBook[];
  setCartBooks: React.Dispatch<React.SetStateAction<CartBook[]>>;
  addBook: (product: CartBook) => void;
  reduceBook: (product: CartBook) => void;
  clearCart: () => void;
}

interface CartContextProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartBooks, setCartBooks] = useState<CartBook[]>(() => {
    if (typeof window === "undefined") return [];

    const storedCart = window.localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(cartBooks));
  }, [cartBooks]);

  const addBook = (product: CartBook) => {
    setCartBooks((prev) => [...prev, product]);

    toast.success("product added to cart successfully", {
      style: { padding: "16px", color: "#01579b" },
      iconTheme: { primary: "#01579b", secondary: "#FFFAEE" },
    });
  };

  const reduceBook = (product: CartBook) => {
    setCartBooks((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      return index === -1 ? prev : prev.filter((_, i) => i !== index);
    });

    toast.success("product removed from cart", {
      style: { padding: "16px", color: "#01579b" },
      iconTheme: { primary: "#01579b", secondary: "#FFFAEE" },
    });
  };

  const clearCart = () => {
    setCartBooks([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartBooks,
        setCartBooks,
        addBook,
        reduceBook,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
