import Link from "next/link";
import { box, btn, listRow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import { deleteArticle } from "@/app/admin/news/actions";
import DeleteButton from "@/app/admin/delete-button";

export default async function NewsAdmin() {
  const articles = await Sql.client`SELECT * FROM articles ORDER BY created_at DESC`;

  return (
    <div className={`mt-5 text-zinc-900 overflow-hidden ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        News
        <Link
          href="/admin/news/new"
          className={`ml-auto ${btn}`}
        >
          New Article
        </Link>
      </div>
      <div className={`${box} !gap-2`}>
        {articles.map((article) => (
          <div key={article.id} className={listRow}>
            <Link
              href={`/admin/news/${article.id}`}
              className="text-blue-600 text-sm hover:underline"
            >
              {article.title}
            </Link>
            <div className="text-xs text-zinc-500 ml-auto whitespace-nowrap">
              {new Date(article.created_at).toLocaleDateString()}
            </div>
            <form action={deleteArticle}>
              <input type="hidden" name="id" value={article.id} />
              <DeleteButton />
            </form>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="text-sm text-zinc-500">No articles yet.</div>
        )}
      </div>
    </div>
  );
}
