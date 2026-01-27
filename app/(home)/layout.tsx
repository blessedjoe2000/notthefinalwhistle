import type { ReactNode } from "react";
import Navbar from "@/components/Navbar/Navbar";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">{children}</main>
    </div>
  );
};

export default HomeLayout;
