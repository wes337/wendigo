import { cookies } from "next/headers";
import crypto from "crypto";
import { redirect } from "next/navigation";

export function getToken() {
  return crypto
    .createHash("sha256")
    .update(process.env.ADMIN_PASSWORD)
    .digest("hex");
}

export async function isAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === getToken();
}

export async function requireAuth() {
  if (!(await isAuthed())) redirect("/admin");
}
