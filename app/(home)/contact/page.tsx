"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { FormEvent } from "react";

export default function Contact() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleContactUs = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!firstName || !lastName) {
      toast.error("Name is required. Please enter first and last name");
      return;
    }

    if (!email) {
      toast.error("Email is required. Please enter email");
      return;
    }

    if (!mobile) {
      toast.error("Phone number is required. Please enter phone number");
      return;
    }

    if (!message) {
      toast.error("Message is required, Please enter a message");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post("/api/send", {
        firstName,
        lastName,
        email,
        mobile,
        message,
      });

      if (response.status === 200) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setMobile("");
        setMessage("");
        toast.success(`Hi ${firstName}, message sent successfully`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="pt-10 text-2xl text-center text-bold text-[#00296b]">
        Contact Us
      </div>
      <form onSubmit={handleContactUs} className="pb-10 p-5 mx-5 mb-5">
        <div className="sm:flex justify-between gap-2">
          <div className="w-full">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="sm:flex justify-between gap-2">
          <div className="w-full">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label htmlFor="mobile">Phone Number</label>
            <input
              id="mobile"
              type="tel"
              placeholder="Enter Phone Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message">What can we help you with?</label>
        </div>

        <textarea
          id="message"
          rows={5}
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="flex gap-1 items-center w-full rounded-md justify-center text-white py-1"
          type="submit"
        >
          {isLoading && <Loader2 className="animate-spin" />}
          Send
        </button>
      </form>
    </div>
  );
}
