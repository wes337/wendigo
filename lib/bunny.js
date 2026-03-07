const STORAGE_KEY = process.env.BUNNY_STORAGE_KEY;
const STORAGE_ZONE = "wes-storage";
const STORAGE_HOST = "storage.bunnycdn.com";
const CDN_HOST = "w-img.b-cdn.net";

export async function uploadFile(key, buffer) {
  const res = await fetch(
    `https://${STORAGE_HOST}/${STORAGE_ZONE}/wendigo/${key}`,
    {
      method: "PUT",
      headers: {
        AccessKey: STORAGE_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    },
  );

  if (!res.ok) throw new Error(`Bunny upload failed: ${res.status}`);
  return `https://${CDN_HOST}/wendigo/${key}`;
}

export async function deleteFile(key) {
  const res = await fetch(
    `https://${STORAGE_HOST}/${STORAGE_ZONE}/wendigo/${key}`,
    {
      method: "DELETE",
      headers: { AccessKey: STORAGE_KEY },
    },
  );

  if (!res.ok) throw new Error(`Bunny delete failed: ${res.status}`);
}
