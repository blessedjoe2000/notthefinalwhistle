"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Order = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);

  if (!userId) {
    return redirect("/sign-in");
  }
  return <div>Order</div>;
};

export default Order;
