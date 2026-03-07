import Link from "next/link";
import { cdn, siteWidth } from "@/app/styles";
import { updatePost, deletePost } from "@/app/admin/posts/actions";
import DeleteButton from "@/app/admin/delete-button";
import PostForm from "@/app/admin/posts/form";
import Sql from "@/lib/sql";
import { redirect } from "next/navigation";

export default async function EditPost({ params }) {
  const { id } = await params;
  const [post] = await Sql.client`SELECT * FROM posts WHERE id = ${id}`;

  if (!post) redirect("/admin");

  const files = await Sql.client`SELECT * FROM files ORDER BY created_at DESC`;
  const attached = await Sql.client`SELECT file_id FROM post_files WHERE post_id = ${id}`;
  post.fileIds = attached.map((r) => r.file_id);

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        <Link href="/admin/posts" className="mr-2">
          <img src={`${cdn}/icons/small/arrow_left.png`} alt="" />
        </Link>
        Edit Post
        <form action={deletePost} className="ml-auto">
          <input type="hidden" name="id" value={post.id} />
          <DeleteButton />
        </form>
      </div>
      <PostForm action={updatePost} post={post} files={files} />
    </div>
  );
}
