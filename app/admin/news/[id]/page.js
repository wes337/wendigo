import Link from "next/link";
import { cdn, siteWidth } from "@/app/styles";
import { updateArticle, deleteArticle } from "@/app/admin/news/actions";
import DeleteButton from "@/app/admin/delete-button";
import ArticleForm from "@/app/admin/news/form";
import Sql from "@/lib/sql";
import { redirect } from "next/navigation";

export default async function EditArticle({ params }) {
  const { id } = await params;
  const [article] = await Sql.client`SELECT * FROM articles WHERE id = ${id}`;

  if (!article) redirect("/admin/news");

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        <Link href="/admin/news" className="mr-2">
          <img src={`${cdn}/icons/small/arrow_left.png`} alt="" />
        </Link>
        Edit Article
        <form action={deleteArticle} className="ml-auto">
          <input type="hidden" name="id" value={article.id} />
          <DeleteButton />
        </form>
      </div>
      <ArticleForm action={updateArticle} article={article} />
    </div>
  );
}
