import { box, cdn, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import CalendarGrid from "@/app/(site)/calendar/grid";

const today = new Date();
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" });

export default async function Calendar() {
  const events = await Sql.client`
    SELECT * FROM wendigo.events
    WHERE date >= ${new Date(today.getFullYear(), today.getMonth(), 1)}
      AND date < ${new Date(today.getFullYear(), today.getMonth() + 1, 1)}
  `;

  const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
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
          {monthFormatter.format(today)} {yearFormatter.format(today)}
        </div>
        <CalendarGrid
          year={today.getFullYear()}
          month={today.getMonth()}
          days={days}
          firstDay={firstDay}
          currentDay={today.getDate()}
          events={events}
        />
      </div>
    </div>
  );
}
