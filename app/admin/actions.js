"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "@/app/admin/auth";

export async function login(formData) {
  const password = formData.get("password");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", getToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin");
}
