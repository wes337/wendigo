"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/app/admin/auth";
import Sql from "@/lib/sql";

function validate(formData) {
  const title = formData.get("title")?.trim();
  const content = formData.get("content")?.trim();
  const author = formData.get("author")?.trim() || "Wendigo Corp PR Dept.";

  if (!title) return { error: "Title is required" };
  if (!content) return { error: "Content is required" };

  return { title, content, author };
}

export async function createArticle(_, formData) {
  await requireAuth();

  const result = validate(formData);
  if (result.error) return result;
  const { title, content, author } = result;

  await Sql.client`
    INSERT INTO articles (title, content, author)
    VALUES (${title}, ${content}, ${author})
  `;

  revalidatePath("/news");
  redirect("/admin/news");
}

export async function updateArticle(_, formData) {
  await requireAuth();

  const id = formData.get("id");
  const result = validate(formData);
  if (result.error) return result;
  const { title, content, author } = result;

  await Sql.client`
    UPDATE articles
    SET title = ${title}, content = ${content}, author = ${author}
    WHERE id = ${id}
  `;

  revalidatePath("/news");
  redirect("/admin/news");
}

export async function deleteArticle(formData) {
  await requireAuth();

  const id = formData.get("id");
  await Sql.client`DELETE FROM articles WHERE id = ${id}`;

  revalidatePath("/news");
  redirect("/admin/news");
}
