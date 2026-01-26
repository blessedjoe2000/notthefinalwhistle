"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import toast from "react-hot-toast";

export interface CartBook {
  _id: string;
  title: string;
  imageUrl?: string;
  price: number;
  newPrice?: number;
}

interface CartContextType {
  cartBooks: CartBook[];
  addBook: (book: CartBook) => void;
  reduceBook: (book: CartBook) => void;
  clearCart: () => void;
}

interface CartContextProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartContextProvider");
  }
  return context;
}

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartBooks, setCartBooks] = useState<CartBook[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = window.localStorage.getItem("cart");
      return stored ? (JSON.parse(stored) as CartBook[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("cart", JSON.stringify(cartBooks));
  }, [cartBooks]);

  const addBook = (book: CartBook) => {
    setCartBooks((prev) => [...prev, book]);

    toast.success("Book added to cart", {
      style: { padding: "16px", color: "#00296b" },
      iconTheme: { primary: "#00296b", secondary: "#faf0ca" },
    });
  };

  const reduceBook = (book: CartBook) => {
    setCartBooks((prev) => {
      const index = prev.findIndex((b) => b._id === book._id);
      return index === -1 ? prev : prev.filter((_, i) => i !== index);
    });

    toast.success("Book removed from cart", {
      style: { padding: "16px", color: "#00296b" },
      iconTheme: { primary: "#00296b", secondary: "#faf0ca" },
    });
  };

  const clearCart = () => {
    setCartBooks([]);
    window.localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartBooks,
        addBook,
        reduceBook,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
