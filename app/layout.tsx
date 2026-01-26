import type { Metadata } from "next";
import "./globals.css";
import { CartContextProvider } from "@/providers/CartContext/CartContext";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Not The Final Whistle",
  description: "A book to cope during grief",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CartContextProvider>
          <body className="">
            <Toaster position="top-right" />
            <Navbar />
            {children}
          </body>
        </CartContextProvider>
      </html>
    </ClerkProvider>
  );
}
