import { siteWidth } from "@/app/styles";
import { createEvent } from "@/app/admin/calendar/actions";
import EventForm from "@/app/admin/calendar/form";

export default function NewEvent() {
  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">New Event</div>
      <EventForm action={createEvent} />
    </div>
  );
}
