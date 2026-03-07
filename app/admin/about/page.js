import { box, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import AboutForm from "@/app/admin/about/form";

export default async function AboutAdmin() {
  const rows = await Sql.client`SELECT * FROM wendigo.pages WHERE slug = 'about'`;
  const page = rows[0] ?? null;

  return (
    <div className={`mt-5 mb-10 text-zinc-900 overflow-hidden ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        Edit About Page
      </div>
      <div className={box}>
        <AboutForm content={page?.content ?? ""} />
      </div>
    </div>
  );
}
