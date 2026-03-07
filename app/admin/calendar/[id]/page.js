import Link from "next/link";
import { cdn, siteWidth } from "@/app/styles";
import { updateEvent, deleteEvent } from "@/app/admin/calendar/actions";
import DeleteButton from "@/app/admin/delete-button";
import EventForm from "@/app/admin/calendar/form";
import Sql from "@/lib/sql";
import { redirect } from "next/navigation";

export default async function EditEvent({ params }) {
  const { id } = await params;
  const [event] = await Sql.client`SELECT * FROM wendigo.events WHERE id = ${id}`;

  if (!event) redirect("/admin/calendar");

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        <Link href="/admin/calendar" className="mr-2">
          <img src={`${cdn}/icons/small/arrow_left.png`} alt="" />
        </Link>
        Edit Event
        <form action={deleteEvent} className="ml-auto">
          <input type="hidden" name="id" value={event.id} />
          <DeleteButton />
        </form>
      </div>
      <EventForm action={updateEvent} event={event} />
    </div>
  );
}
