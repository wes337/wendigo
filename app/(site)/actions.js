"use server";

import { revalidatePath } from "next/cache";
import Sql from "@/lib/sql";
import { getVisitor } from "@/lib/visitor";
import { REACTIONS } from "@/app/(site)/reactions";

export async function getSlogans() {
  const rows = await Sql.client`SELECT text FROM wendigo.slogans ORDER BY id`;
  return rows.map((r) => r.text);
}

// Sets the visitor's single reaction on a post. A visitor matches by cookie OR IP, so clearing cookies
// or switching networks alone doesn't grant a second reaction. Clicking the current reaction removes it.
export async function toggleReaction(postId, reaction) {
  if (!Number.isInteger(postId) || !REACTIONS.some((r) => r.id === reaction)) return;

  const { id, ipHash } = await getVisitor({ create: true });
  await Sql.client.begin(async (sql) => {
    const removed = await sql`
      DELETE FROM wendigo.post_reactions
      WHERE post_id = ${postId} AND (visitor_id = ${id} OR ip_hash = ${ipHash})
      RETURNING reaction
    `;
    if (removed.some((r) => r.reaction === reaction)) return;
    await sql`
      INSERT INTO wendigo.post_reactions (post_id, visitor_id, ip_hash, reaction)
      SELECT id, ${id}, ${ipHash}, ${reaction} FROM wendigo.posts WHERE id = ${postId}
    `;
  });

  revalidatePath("/");
}
