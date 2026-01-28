"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [firstName, setFirstName] = useState<String>("");
  const [lastName, setLastName] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [mobile, setMobile] = useState<String>("");
  const [message, setMessage] = useState<String>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContactUs = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      return toast.error("Name is required. Please enter first and last name");
    }

    if (!email) {
      return toast.error("Email is required. Please enter email");
    }

    if (!mobile) {
      return toast.error("Phone number is required. Please enter phone number");
    }

    if (!message) {
      return toast.error("Message is required, Please enter a message");
    }

    setIsLoading(true);
    const response = await axios.post("/api/send", {
      firstName,
      lastName,
      email,
      mobile,
      message,
    });

    if (response.status === 200) {
      setFirstName(" ");
      setLastName(" ");
      setEmail(" ");
      setMobile(" ");
      setMessage(" ");
      toast.success(`Hi ${firstName}, message sent successfully`);
    }
    setIsLoading(false);
  };
  return (
    <div className="">
      <form onSubmit={handleContactUs} className=" pb-10 p-5 mx-5 mb-5">
        <div className="sm:flex justify-between gap-2">
          <div className="w-full">
            <label htmlFor="firstName" name="firstName">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" name="lastName">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="sm:flex justify-between gap-2">
          <div className="w-full">
            <label htmlFor="email" name="email">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="mobile" name="mobile">
              Phone Number
            </label>
            <input
              type="number"
              placeholder="Enter Phone Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" name="message">
            What can we help you with?
          </label>
        </div>
        <textarea
          name="message"
          id=""
          cols="10"
          rows="5"
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className="flex gap-1 items-center" type="submit">
          {isLoading && <Loader2 className=" animate-spin" />}
          Send
        </button>
      </form>
    </div>
  );
}
