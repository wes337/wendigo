"use server";

import { Resend } from "resend";
import Sql from "@/lib/sql";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiry(_, formData) {
  const name = formData.get("name")?.trim()?.slice(0, 100);
  const email = formData.get("email")?.trim()?.slice(0, 320);
  const message = formData.get("message")?.trim()?.slice(0, 5000);

  if (!name) return { error: "Name is required." };
  if (name.length > 100) return { error: "Name must be 100 characters or less." };
  if (!email || email.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "A valid email is required." };
  if (email.length > 320) return { error: "Email must be 320 characters or less." };
  if (!message || message.length < 10) return { error: "Message must be at least 10 characters." };
  if (message.length > 5000) return { error: "Message must be 5000 characters or less." };

  try {
    await Sql.client`
      INSERT INTO inquiries (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    await resend.emails.send({
      from: "Wendigo Corp <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return { success: true };
  } catch (e) {
    console.error("Inquiry error:", e);
    return { error: "Failed to send inquiry. Please try again." };
  }
}
