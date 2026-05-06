"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/admin/auth";
import Sql from "@/lib/sql";

export async function createSlogan(_, formData) {
  await requireAuth();

  const text = formData.get("text")?.trim();
  if (!text || text.length < 1) return { error: "Slogan text is required" };
  if (text.length > 300) return { error: "Slogan must be 300 characters or less" };

  await Sql.client`
    INSERT INTO wendigo.slogans (text) VALUES (${text})
  `;

  revalidatePath("/admin/slogans");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSlogan(formData) {
  await requireAuth();

  const id = formData.get("id");
  await Sql.client`DELETE FROM wendigo.slogans WHERE id = ${id}`;

  revalidatePath("/admin/slogans");
  revalidatePath("/");
}
