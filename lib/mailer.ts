import "server-only";

import nodemailer, { Transporter } from "nodemailer";
import type { SentMessageInfo } from "nodemailer";

export const transporter: Transporter<SentMessageInfo> =
  nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ADMIN_EMAIL as string,
      pass: process.env.APP_PASSWORD as string,
    },
  });
