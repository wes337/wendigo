import { siteWidth } from "@/app/styles";
import { createPost } from "@/app/admin/posts/actions";
import PostForm from "@/app/admin/posts/form";
import Sql from "@/lib/sql";

export default async function NewPost() {
  const files = await Sql.client`SELECT * FROM files ORDER BY created_at DESC`;

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">New Post</div>
      <PostForm action={createPost} files={files} />
    </div>
  );
}
