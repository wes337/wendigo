import { box, listRow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import { deleteSlogan } from "@/app/admin/slogans/actions";
import DeleteButton from "@/app/admin/delete-button";
import SloganForm from "@/app/admin/slogans/form";

export default async function SlogansAdmin() {
  const slogans =
    await Sql.client`SELECT * FROM wendigo.slogans ORDER BY created_at DESC`;

  return (
    <div className={`mt-5 text-zinc-900 overflow-hidden ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">Slogans</div>
      <div className={`${box} !gap-2`}>
        <SloganForm />
        <hr className="border-[var(--t-panel-border)]" />
        {slogans.map((slogan) => (
          <div key={slogan.id} className={listRow}>
            <div className="text-sm flex-1">{slogan.text}</div>
            <form action={deleteSlogan}>
              <input type="hidden" name="id" value={slogan.id} />
              <DeleteButton />
            </form>
          </div>
        ))}
        {slogans.length === 0 && (
          <div className="text-sm text-zinc-500">No slogans yet.</div>
        )}
      </div>
    </div>
  );
}
