import { siteWidth } from "@/app/styles";
import { createArticle } from "@/app/admin/news/actions";
import ArticleForm from "@/app/admin/news/form";

export default function NewArticle() {
  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">New Article</div>
      <ArticleForm action={createArticle} />
    </div>
  );
}
