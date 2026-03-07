import Link from "next/link";
import { box, cdn, insetShadow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import { redirect } from "next/navigation";
import { deleteInquiry } from "@/app/admin/inquiries/actions";
import DeleteButton from "@/app/admin/delete-button";

export default async function ViewInquiry({ params }) {
  const { id } = await params;
  const [inquiry] = await Sql.client`SELECT * FROM inquiries WHERE id = ${id}`;

  if (!inquiry) redirect("/admin/inquiries");

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        <Link href="/admin/inquiries" className="mr-2">
          <img src={`${cdn}/icons/small/arrow_left.png`} alt="" />
        </Link>
        Inquiry
        <form action={deleteInquiry} className="ml-auto">
          <input type="hidden" name="id" value={inquiry.id} />
          <DeleteButton />
        </form>
      </div>
      <div className={box}>
        <div className="flex flex-col gap-2.5 text-sm">
          <div>
            <span className="font-bold">Name:</span> {inquiry.name}
          </div>
          <div>
            <span className="font-bold">Email:</span>{" "}
            <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
              {inquiry.email}
            </a>
          </div>
          <div>
            <span className="font-bold">Date:</span>{" "}
            {new Date(inquiry.created_at).toLocaleString()}
          </div>
          <div className={`p-2.5 bg-zinc-100 border-1 border-zinc-500/50 rounded-[2px] whitespace-pre-wrap ${insetShadow}`}>
            {inquiry.message}
          </div>
        </div>
      </div>
    </div>
  );
}
