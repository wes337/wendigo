import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";

const COOKIE = "visitor";

// Identifies an anonymous visitor two ways: a long-lived cookie id and a SHA-256 hash of their IP
// (raw IPs are never stored). Pass `create` from a server action to issue the cookie when it's missing.
export async function getVisitor({ create = false } = {}) {
  const [h, store] = await Promise.all([headers(), cookies()]);

  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  let id = store.get(COOKIE)?.value ?? "";
  if (!id && create) {
    id = randomUUID();
    store.set(COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return { id, ipHash };
}
