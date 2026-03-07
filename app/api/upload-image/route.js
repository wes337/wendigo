import { cookies } from "next/headers";
import { getToken } from "@/app/admin/auth";

const STORAGE_ZONE = "wes-storage";
const STORAGE_HOST = "storage.bunnycdn.com";
const CDN_HOST = "w-img.b-cdn.net";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token !== getToken()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawFilename = request.headers.get("x-filename");
  const filesize = Number(request.headers.get("content-length"));

  if (!rawFilename) {
    return Response.json({ error: "Missing filename" }, { status: 400 });
  }

  if (!filesize || filesize > 10 * 1024 * 1024) {
    return Response.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const filename = rawFilename.replace(/[/\\]/g, "").replace(/\.\./g, "");
  if (!filename) {
    return Response.json({ error: "Invalid filename" }, { status: 400 });
  }

  const key = `images/${Date.now()}-${filename}`;

  const res = await fetch(
    `https://${STORAGE_HOST}/${STORAGE_ZONE}/wendigo/${key}`,
    {
      method: "PUT",
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_KEY,
        "Content-Type": "application/octet-stream",
        "Content-Length": filesize,
      },
      body: request.body,
      duplex: "half",
    },
  );

  if (!res.ok) {
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }

  const url = `https://${CDN_HOST}/wendigo/${key}`;
  return Response.json({ url });
}
