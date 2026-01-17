import { box, dropShadow, insetShadow } from "@/app/styles";
import Image from "next/image";

const EVENTS = [
  {
    date: new Date(Date.parse("29 Jan 2026 18:00:00 EDT")),
    name: "Show",
    href: "https://www.google.com",
  },
];

const today = new Date();
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" });
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const days = getDaysInMonth(today);
  const firstDay = getFirstDayOfMonth(today);

  return (
    <div className="mt-5 text-zinc-900">
      <div className="flex font-bold text-sm mb-2.5">
        <Image
          className="w-[16px] h-[16px] mr-1"
          src={`/icons/small/calendar.png`}
          width={16}
          height={16}
          alt=""
          unoptimized
        />
        Calendar
      </div>
      <div className={`${box} px-0`}>
        <div className="grid grid-cols-7 px-5 gap-2.5 w-[90vw] md:w-[600px] max-w-[90vw]">
          <div className="font-bold pb-2.5 col-span-full">
            {monthFormatter.format(today)} {yearFormatter.format(today)}
          </div>
          {weekdays.map((day) => {
            return (
              <div
                key={day}
                className="text-xs text-center font-bold w-full text-zinc-700"
              >
                {day}
              </div>
            );
          })}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: days }).map((_, day) => {
            const dayOfMonth = day + 1;
            const todayDate = new Date(
              today.getFullYear(),
              today.getMonth(),
              dayOfMonth,
            );

            const isCurrentDay = dayOfMonth === today.getDate();
            const isEventDay = EVENTS.find((event) =>
              isSameDay(event.date, todayDate),
            );

            const text = isCurrentDay
              ? "font-bold text-zinc-500 border-zinc-600"
              : isEventDay
                ? "text-blue-600 border-blue-600/75"
                : "text-zinc-500 border-zinc-700/50";

            const link = isEventDay
              ? "bg-blue-200/50 cursor-pointer hover:bg-blue-200/75"
              : "";

            return (
              <div
                key={day}
                className={`group relative border-1 rounded-[4px] h-[48px] md:h-[64px] w-full ${insetShadow} ${text} ${link}`}
              >
                <div className="p-1 text-[12px]">{dayOfMonth}</div>
                {isEventDay && (
                  <div className="flex items-center uppercase text-[10px] bottom-0 right-0 m-[4px] absolute">
                    <Image
                      className={`h-[15px] w-[15px] ${dropShadow}`}
                      src={"/icons/small/off.png"}
                      width={15}
                      height={15}
                      alt=""
                      unoptimized
                    />
                  </div>
                )}
                {isCurrentDay && (
                  <div className="flex items-center uppercase text-[10px] bottom-0 right-0 m-[4px] absolute">
                    <Image
                      className={`h-[15px] w-[15px] ${dropShadow}`}
                      src={"/icons/small/on.png"}
                      width={15}
                      height={15}
                      alt=""
                      unoptimized
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
