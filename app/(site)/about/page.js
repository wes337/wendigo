import { box, cdn } from "@/app/styles";
import Sql from "@/lib/sql";

export default async function About() {
  const rows = await Sql.client`SELECT content FROM wendigo.pages WHERE slug = 'about'`;
  const content = rows[0]?.content ?? "";

  return (
    <div className="mt-5 text-[var(--t-text)]">
      <div className="flex font-bold text-sm mb-2.5">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/information.png`}
          alt=""
        />
        About
      </div>
      <div className={`${box}`}>
        {content ? (
          <div
            className="about-prose text-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-sm text-[var(--t-text-muted)]">No content yet.</div>
        )}
      </div>
    </div>
  );
}
