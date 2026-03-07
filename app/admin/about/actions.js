"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/admin/auth";
import Sql from "@/lib/sql";

export async function updatePage(_, formData) {
  await requireAuth();

  const slug = formData.get("slug");
  const content = formData.get("content") ?? "";

  const existing =
    await Sql.client`SELECT id FROM pages WHERE slug = ${slug}`;

  if (existing.length > 0) {
    await Sql.client`
      UPDATE pages
      SET content = ${content}, updated_at = NOW()
      WHERE slug = ${slug}
    `;
  } else {
    await Sql.client`
      INSERT INTO pages (slug, title, content)
      VALUES (${slug}, ${slug}, ${content})
    `;
  }

  revalidatePath(`/${slug}`);
  return { success: true };
}
