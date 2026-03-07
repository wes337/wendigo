"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/app/admin/auth";
import Sql from "@/lib/sql";
import { deleteFile } from "@/lib/bunny";

export async function remove(formData) {
  await requireAuth();

  const id = formData.get("id");
  const [file] = await Sql.client`SELECT * FROM files WHERE id = ${id}`;

  if (file) {
    await deleteFile(file.key);
    await Sql.client`DELETE FROM files WHERE id = ${id}`;
  }

  revalidatePath("/admin/files");
  revalidatePath("/");
  redirect("/admin/files");
}
