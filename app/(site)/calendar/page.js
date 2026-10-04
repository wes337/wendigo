import { Suspense } from "react";
import Link from "next/link";
import { box, btn, cdn, siteWidth } from "@/app/styles";
import Sql from "@/lib/sql";
import CalendarGrid from "@/app/(site)/calendar/grid";

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const shortMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" });

const navBtn = `${btn} gap-1 w-[64px] text-xs px-[8px] py-[4px]`;

// "YYYY-MM" for the `?month=` param
function monthParam(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// Shows `?month=YYYY-MM`, else the month of `?event=<id>` (e.g. linked from the ticker), else the current month
export default async function Calendar({ searchParams }) {
  const today = new Date();
  const { event: eventId, month: monthQuery } = await searchParams;

  let shown = today;
  const monthMatch = /^(\d{4})-(\d{2})$/.exec(monthQuery ?? "");
  if (monthMatch && Number(monthMatch[2]) >= 1 && Number(monthMatch[2]) <= 12) {
    shown = new Date(Number(monthMatch[1]), Number(monthMatch[2]) - 1, 1);
  } else if (eventId && /^\d+$/.test(eventId)) {
    const [linked] = await Sql.client`
      SELECT date FROM wendigo.events WHERE id = ${eventId}
    `;
    if (linked) shown = new Date(linked.date);
  }

  const year = shown.getFullYear();
  const month = shown.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);

  const events = await Sql.client`
    SELECT * FROM wendigo.events
    WHERE date >= ${new Date(year, month, 1)}
      AND date < ${next}
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
        <div className="flex items-center gap-2 px-5">
          <div className="font-bold mr-auto">
            {monthFormatter.format(shown)} {yearFormatter.format(shown)}
          </div>
          {!isCurrentMonth && (
            <Link href="/calendar" className={navBtn}>
              Today
            </Link>
          )}
          <Link href={`/calendar?month=${monthParam(prev)}`} className={navBtn}>
            <img className="w-[16px] h-[16px]" src={`${cdn}/icons/small/arrow_left.png`} alt="" />
            {shortMonthFormatter.format(prev)}
          </Link>
          <Link href={`/calendar?month=${monthParam(next)}`} className={navBtn}>
            {shortMonthFormatter.format(next)}
            <img className="w-[16px] h-[16px]" src={`${cdn}/icons/small/arrow_right.png`} alt="" />
          </Link>
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
