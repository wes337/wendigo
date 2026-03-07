import Link from "next/link";
import { deletePost } from "@/app/admin/posts/actions";
import DeleteButton from "@/app/admin/delete-button";
import { box, btn, listRow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";

export default async function Posts() {
  const posts = await Sql.client`SELECT * FROM wendigo.posts ORDER BY created_at DESC`;

  return (
    <div className={`mt-5 text-zinc-900 overflow-hidden ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        Posts
        <Link
          href="/admin/posts/new"
          className={`ml-auto ${btn}`}
        >
          New Post
        </Link>
      </div>
      <div className={`${box} !gap-2`}>
        {posts.map((post) => (
          <div key={post.id} className={listRow}>
            <Link
              href={`/admin/posts/${post.id}`}
              className="text-blue-600 text-sm hover:underline"
            >
              {post.title}
            </Link>
            <div className="text-xs text-zinc-500 ml-auto whitespace-nowrap">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <DeleteButton />
            </form>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-sm text-zinc-500">No posts yet.</div>
        )}
      </div>
    </div>
  );
}
