import Link from "next/link";
import { box, btn, cdn, listRow, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import { deleteEvent } from "@/app/admin/calendar/actions";
import DeleteButton from "@/app/admin/delete-button";

export default async function CalendarAdmin() {
  const events = await Sql.client`SELECT * FROM wendigo.events ORDER BY date DESC`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => new Date(e.date) >= today);
  const past = events.filter((e) => new Date(e.date) < today);

  const renderList = (items, empty) => (
    <div className={`${box} !gap-2`}>
      {items.map((event) => (
        <div key={event.id} className={listRow}>
          <img
            className="w-[16px] h-[16px] shrink-0"
            src={`${cdn}/icons/small/${event.icon}.png`}
            alt=""
          />
          <Link
            href={`/admin/calendar/${event.id}`}
            className="text-blue-600 text-sm hover:underline"
          >
            {event.name}
          </Link>
          <div className="text-xs text-zinc-500 ml-auto whitespace-nowrap">
            {new Date(event.date).toLocaleDateString()}
          </div>
          <form action={deleteEvent}>
            <input type="hidden" name="id" value={event.id} />
            <DeleteButton />
          </form>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-sm text-zinc-500">{empty}</div>
      )}
    </div>
  );

  return (
    <div className={`mt-5 text-zinc-900 overflow-hidden ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        Upcoming Events
        <Link
          href="/admin/calendar/new"
          className={`ml-auto ${btn}`}
        >
          New Event
        </Link>
      </div>
      {renderList(upcoming, "No upcoming events.")}
      <div className="flex font-bold text-sm mb-2.5 mt-5">Past Events</div>
      {renderList(past, "No past events.")}
    </div>
  );
}
