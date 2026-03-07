"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/app/admin/auth";
import Sql from "@/lib/sql";

export async function deleteInquiry(formData) {
  await requireAuth();

  const id = formData.get("id");
  await Sql.client`DELETE FROM wendigo.inquiries WHERE id = ${id}`;

  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries");
}
