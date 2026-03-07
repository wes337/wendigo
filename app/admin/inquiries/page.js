import Link from "next/link";
import { box, listRow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import { deleteInquiry } from "@/app/admin/inquiries/actions";
import DeleteButton from "@/app/admin/delete-button";

export default async function InquiriesAdmin() {
  const inquiries = await Sql.client`SELECT * FROM wendigo.inquiries ORDER BY created_at DESC`;

  return (
    <div className={`mt-5 text-zinc-900 overflow-hidden ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        Inquiries
      </div>
      <div className={`${box} !gap-2`}>
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className={listRow}>
            <Link
              href={`/admin/inquiries/${inquiry.id}`}
              className="text-blue-600 text-sm hover:underline truncate"
            >
              {inquiry.name} — {inquiry.email}
            </Link>
            <div className="text-xs text-zinc-500 ml-auto whitespace-nowrap">
              {new Date(inquiry.created_at).toLocaleDateString()}
            </div>
            <form action={deleteInquiry}>
              <input type="hidden" name="id" value={inquiry.id} />
              <DeleteButton />
            </form>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="text-sm text-zinc-500">No inquiries yet.</div>
        )}
      </div>
    </div>
  );
}
