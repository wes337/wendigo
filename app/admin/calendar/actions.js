"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/app/admin/auth";
import Sql from "@/lib/sql";

const VALID_COLORS = new Set([
  "blue", "red", "green", "orange", "purple", "pink", "yellow", "zinc",
]);

function validate(formData) {
  const name = formData.get("name")?.trim();
  const description = formData.get("description")?.trim() || null;
  const date = formData.get("date");
  const url = formData.get("url")?.trim() || null;
  const icon = formData.get("icon")?.trim().replace(/\.png$/, "") || "events";
  const color = formData.get("color") || "blue";

  if (!name) return { error: "Name is required" };
  if (!date || isNaN(Date.parse(date))) return { error: "Valid date is required" };
  if (url) {
    try { new URL(url); } catch { return { error: "Invalid URL" }; }
  }
  if (!/^[a-z0-9_]+$/.test(icon)) return { error: "Invalid icon name" };
  if (!VALID_COLORS.has(color)) return { error: "Invalid color" };

  return { name, description, date, url, icon, color };
}

export async function createEvent(_, formData) {
  await requireAuth();

  const result = validate(formData);
  if (result.error) return result;
  const { name, description, date, url, icon, color } = result;

  await Sql.client`
    INSERT INTO wendigo.events (name, description, date, url, icon, color)
    VALUES (${name}, ${description}, ${date}, ${url}, ${icon}, ${color})
  `;

  revalidatePath("/calendar");
  redirect("/admin/calendar");
}

export async function updateEvent(_, formData) {
  await requireAuth();

  const id = formData.get("id");
  const result = validate(formData);
  if (result.error) return result;
  const { name, description, date, url, icon, color } = result;

  await Sql.client`
    UPDATE wendigo.events
    SET name = ${name}, description = ${description}, date = ${date}, url = ${url}, icon = ${icon}, color = ${color}
    WHERE id = ${id}
  `;

  revalidatePath("/calendar");
  redirect("/admin/calendar");
}

export async function deleteEvent(formData) {
  await requireAuth();

  const id = formData.get("id");
  await Sql.client`DELETE FROM wendigo.events WHERE id = ${id}`;

  revalidatePath("/calendar");
  redirect("/admin/calendar");
}
