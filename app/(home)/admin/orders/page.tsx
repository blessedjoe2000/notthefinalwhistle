"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { Skeleton, Stack } from "@mui/material";
import { Loader2 } from "lucide-react";

// Define types for the order structure
interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface BookData {
  title?: string;
  imageUrl?: string;
}

interface LineItem {
  price_data: {
    book_data: BookData;
  };
}

interface OrderProduct {
  title: string;
  imageUrl?: string;
  quantity?: number;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  line_items: LineItem[];
  orderProducts: OrderProduct[];
  createdAt: string;
  paid: boolean;
  status: string;
}

const updateOrderStatus = ["Pending", "Processing", "Shipped", "Delivered"];

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};

const Order: React.FC = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>("");

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const subtitle = useRef<HTMLHeadingElement | null>(null);

  const getOrders = async () => {
    const response = await axios.get<Order[]>(`/api/orders`);
    setOrders(response.data);
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!user || user.publicMetadata?.isAdmin !== true) {
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      await getOrders();
      Modal.setAppElement("body");
    };
    fetchOrders();
  }, [orderStatus, deleteOrderId]);

  const dateToUSFormat = (dateString: string) => {
    const originalDate = new Date(dateString);
    return originalDate.toLocaleString("en-US");
  };

  const openModal = () => setModalIsOpen(true);
  const afterOpenModal = () => {
    if (subtitle.current) subtitle.current.style.color = "#00296b";
  };
  const closeModal = () => setModalIsOpen(false);

  const handleEditStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orderStatus) {
      return toast.error("Status must change to be updated", {
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

    if (!selectedOrderId) return;

    setIsSaveLoading(true);
    await axios.patch(`/api/orders/${selectedOrderId}`, { orderStatus });
    setIsSaveLoading(false);

    await getOrders();
    setOrderStatus("");
    closeModal();

    toast.success("status updated", {
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
  };

  const handleEdit = (orderId: string, currentStatus: string) => {
    setSelectedOrderId(orderId);
    setOrderStatus(currentStatus);
    openModal();
  };

  const openDeleteModal = (orderId: string) => {
    setDeleteModalIsOpen(true);
    setDeleteOrderId(orderId);
  };
  const afterOpenDeleteModal = () => {
    if (subtitle.current) subtitle.current.style.color = "#00296b";
  };
  const closeDeleteModal = () => setDeleteModalIsOpen(false);

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;

    setIsDeleteLoading(true);
    await axios.delete(`/api/orders/${deleteOrderId}`);
    setIsDeleteLoading(false);

    await getOrders();
    closeDeleteModal();

    toast.success("order deleted", {
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
  };

  if (!isLoaded) {
    return (
      <div className="py-10">
        <Stack spacing={2}>
          <div className="flex justify-center">
            <Skeleton variant="rectangular" width={200} height={40} />
          </div>
          <div className="flex gap-5 flex-col px-5">
            <Skeleton variant="rectangular" width="full" height={100} />
            <Skeleton variant="rectangular" width="full" height={100} />
            <Skeleton variant="rectangular" width="full" height={100} />
            <Skeleton variant="rectangular" width="full" height={100} />
            <Skeleton variant="rectangular" width="full" height={100} />
            <Skeleton variant="rectangular" width="full" height={100} />
          </div>
        </Stack>
      </div>
    );
  }

  return (
    <div className="mx-5 mb-10 mt-5 ">
      {orders.length === 0 ? (
        <div className="my-10">
          <p className="text-center font-bold">You do not have any order.</p>
        </div>
      ) : (
        <div>
          <p className="text-center text-2xl text-light-green py-2 text-[#00296b]">
            Orders Received
          </p>
          <div className="">
            <div className="sm:flex justify-between items-center bg-[#00296b] text-white py-2 px-5 gap-2">
              <div>Date & Time</div>
              <div>Recipients info</div>
              <div>Shipping Address</div>
              <div>Books ordered</div>
              <div>Payment Confirmation</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            <div className="sm:text-sm">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="sm:border-b-2 sm:border-light-green py-2 sm:flex justify-between items-center gap-2 px-2 border-b-2 border-light-green "
                >
                  {/* Date */}
                  <div className="border-b-2 border-[#00296b]/30 sm:border-none ">
                    <p>{dateToUSFormat(order.createdAt)?.split(",")[0]}</p>
                    <p>{dateToUSFormat(order.createdAt)?.split(",")[1]}</p>
                  </div>

                  {/* Recipient */}
                  <div className="border-b-2 border-[#00296b]/30 sm:border-none ">
                    <p>
                      {order.name
                        .split(" ")
                        .map((n) => n[0].toUpperCase() + n.slice(1))
                        .join(" ")}
                    </p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </div>

                  {/* Shipping */}
                  <div className="border-b-2 border-[#00296b]/30 sm:border-none ">
                    <div className="flex gap-1">
                      <p>{order.address.line1}</p>
                      <p>{order.address.line2}</p>
                    </div>
                    <p>{order.address.city}</p>
                    <div className="flex gap-1">
                      <p>{order.address.state}</p>
                      <p>{order.address.postal_code}</p>
                      <p>{order.address.country}</p>
                    </div>
                  </div>

                  {/* Books */}
                  <div className="border-b-2 border-[#00296b]/30 sm:border-none ">
                    {order.orderProducts.map((book) => (
                      <div
                        key={`${order._id}-${book.title}`}
                        className="flex items-center gap-1"
                      >
                        <div className="my-1">{book.title}</div>
                      </div>
                    ))}
                  </div>

                  {/* Paid */}
                  <div className="border-b-2 border-[#00296b]/30 sm:border-none ">
                    {order.paid ? (
                      <p className="text-green-600">Yes</p>
                    ) : (
                      <p className="text-[#e71d36]!">No</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="border-b-2 border-[#00296b]/30 sm:border-none ">
                    <p>{order.status}</p>
                  </div>

                  {/* Actions */}
                  <div className="sm:flex gap-1 flex-col justify-center items-center text-sm mt-1 ">
                    <button
                      onClick={() => handleEdit(order._id, order.status)}
                      className="px-2 py-1 rounded-sm text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(order._id)}
                      className="px-2 py-1 rounded-sm text-white"
                    >
                      Delete
                    </button>
                  </div>
                  {/* Modals */}
                  <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <p ref={subtitle} className="text-lg pb-2">
                        Update order status
                      </p>
                      <form onSubmit={handleEditStatus}>
                        <select
                          className=""
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                        >
                          {updateOrderStatus.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2 mt-2">
                          <button
                            type="submit"
                            className="px-2 py-1 rounded-sm text-white flex gap-1 items-center"
                          >
                            {isSaveLoading && (
                              <Loader2 className=" animate-spin" />
                            )}
                            Save
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded-sm text-white"
                            onClick={closeModal}
                          >
                            Close
                          </button>
                        </div>
                      </form>
                    </div>
                  </Modal>

                  <Modal
                    isOpen={deleteModalIsOpen}
                    onAfterOpen={afterOpenDeleteModal}
                    onRequestClose={closeDeleteModal}
                    style={customStyles}
                    ariaHideApp={false}
                  >
                    <div className="flex flex-col justify-center items-center font-bold">
                      <p ref={subtitle} className="text-xl">
                        Are you sure?
                      </p>
                      <p className="py-2 ">Do you want to proceed to delete?</p>
                      <div className="flex gap-2">
                        <button
                          className="rounded-md bg-[#e71d36]! px-2 py-1 text-white flex gap-1 items-center"
                          onClick={handleDeleteOrder}
                        >
                          {isDeleteLoading && (
                            <Loader2 className=" animate-spin" />
                          )}
                          Delete
                        </button>
                        <button
                          className="px-2 py-1 rounded-sm text-white"
                          onClick={closeDeleteModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
