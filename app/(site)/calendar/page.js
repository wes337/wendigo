import { Suspense } from "react";
import { box, cdn, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import CalendarGrid from "@/app/(site)/calendar/grid";

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" });

// Shows the current month, or the month of `?event=<id>` when linked to one (e.g. from the ticker)
export default async function Calendar({ searchParams }) {
  const today = new Date();
  const { event: eventId } = await searchParams;

  let shown = today;
  if (eventId && /^\d+$/.test(eventId)) {
    const [linked] = await Sql.client`
      SELECT date FROM wendigo.events WHERE id = ${eventId}
    `;
    if (linked) shown = new Date(linked.date);
  }

  const year = shown.getFullYear();
  const month = shown.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const events = await Sql.client`
    SELECT * FROM wendigo.events
    WHERE date >= ${new Date(year, month, 1)}
      AND date < ${new Date(year, month + 1, 1)}
  `;

  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <div className={`mt-5 text-[var(--t-text)] ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/calendar.png`}
          alt=""
        />
        Calendar
      </div>
      <div className={`${box} px-0`}>
        <div className="font-bold pb-0 px-5">
          {monthFormatter.format(shown)} {yearFormatter.format(shown)}
        </div>
        <Suspense>
          <CalendarGrid
            year={year}
            month={month}
            days={days}
            firstDay={firstDay}
            currentDay={isCurrentMonth ? today.getDate() : null}
            events={events}
          />
        </Suspense>
      </div>
    </div>
  );
}
