import { box, cdn, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";

export default async function News() {
  const articles = await Sql.client`SELECT * FROM articles ORDER BY created_at DESC`;

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/newspaper.png`}
          alt=""
        />
        Corporate News
      </div>
      <div className="flex flex-col gap-5">
        {articles.map((article) => (
          <div key={article.id} className={box}>
            <div className="flex flex-col">
              <div className="font-bold text-md">{article.title}</div>
              <div className="text-xs text-zinc-500">
                {new Date(article.created_at).toLocaleDateString()} &mdash; {article.author}
              </div>
              <div className="about-prose text-sm mt-2.5" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <div className={box}>
            <div className="text-sm text-zinc-500">No press releases yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
