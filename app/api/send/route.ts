import nodemailer from "nodemailer";

interface ContactRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  message: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: ContactRequestBody = await req.json();
    const { firstName, lastName, email, mobile, message } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL as string,
        pass: process.env.APP_PASSWORD as string,
      },
    });

    await transporter.sendMail({
      from: {
        name: "Book Store.",
        address: process.env.ADMIN_EMAIL as string,
      },
      to: [
        process.env.ADMIN_NOTIFY_EMAIL as string,
        process.env.ORG_EMAIL as string,
      ],
      subject: "Message from Book Website",
      text: `${firstName} ${lastName} with email "${email}" and phone number "${mobile}" sent a message with this content: "${message}"`,
    });

    return new Response(JSON.stringify({ message: "Message sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
