"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/app/admin/auth";
import Sql from "@/lib/sql";

function validate(formData) {
  const title = formData.get("title")?.trim();
  const content = formData.get("content")?.trim();
  const author = formData.get("author")?.trim() || "Wendigo";
  const fileIds = formData.getAll("files").map(Number).filter(Number.isFinite);

  if (!title) return { error: "Title is required" };
  if (!content) return { error: "Content is required" };

  return { title, content, author, fileIds };
}

export async function createPost(_, formData) {
  await requireAuth();

  const result = validate(formData);
  if (result.error) return result;
  const { title, content, author, fileIds } = result;

  const [{ id }] = await Sql.client`
    INSERT INTO posts (title, content, author)
    VALUES (${title}, ${content}, ${author})
    RETURNING id
  `;

  if (fileIds.length > 0) {
    await Sql.client`
      INSERT INTO post_files (post_id, file_id)
      SELECT ${id}, unnest(${fileIds}::int[])
    `;
  }

  revalidatePath("/");
  redirect("/admin/posts");
}

export async function updatePost(_, formData) {
  await requireAuth();

  const id = formData.get("id");
  const result = validate(formData);
  if (result.error) return result;
  const { title, content, author, fileIds } = result;

  await Sql.client`
    UPDATE posts
    SET title = ${title}, content = ${content}, author = ${author}
    WHERE id = ${id}
  `;

  await Sql.client`DELETE FROM post_files WHERE post_id = ${id}`;
  if (fileIds.length > 0) {
    await Sql.client`
      INSERT INTO post_files (post_id, file_id)
      SELECT ${id}, unnest(${fileIds}::int[])
    `;
  }

  revalidatePath("/");
  redirect("/admin/posts");
}

export async function deletePost(formData) {
  await requireAuth();

  const id = formData.get("id");
  await Sql.client`DELETE FROM posts WHERE id = ${id}`;

  revalidatePath("/");
  redirect("/admin/posts");
}
