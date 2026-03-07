"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { cdn, dropShadow, insetShadow, siteWidth } from "@/app/styles";

const COLOR_MAP = {
  blue: { text: "text-blue-600", border: "border-blue-600/75", bg: "bg-blue-200/50", hover: "hover:bg-blue-200/75" },
  red: { text: "text-red-600", border: "border-red-600/75", bg: "bg-red-200/50", hover: "hover:bg-red-200/75" },
  green: { text: "text-green-600", border: "border-green-600/75", bg: "bg-green-200/50", hover: "hover:bg-green-200/75" },
  orange: { text: "text-orange-600", border: "border-orange-600/75", bg: "bg-orange-200/50", hover: "hover:bg-orange-200/75" },
  purple: { text: "text-purple-600", border: "border-purple-600/75", bg: "bg-purple-200/50", hover: "hover:bg-purple-200/75" },
  pink: { text: "text-pink-600", border: "border-pink-600/75", bg: "bg-pink-200/50", hover: "hover:bg-pink-200/75" },
  yellow: { text: "text-yellow-600", border: "border-yellow-600/75", bg: "bg-yellow-200/50", hover: "hover:bg-yellow-200/75" },
  zinc: { text: "text-zinc-600", border: "border-zinc-600/75", bg: "bg-zinc-300/50", hover: "hover:bg-zinc-300/75" },
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function CalendarGrid({ year, month, days, firstDay, currentDay, events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
      <div className={`grid grid-cols-7 px-5 gap-2.5 ${siteWidth}`}>
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-xs text-center font-bold w-full text-zinc-700"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }).map((_, day) => {
          const dayOfMonth = day + 1;
          const cellDate = new Date(year, month, dayOfMonth);

          const isCurrentDay = dayOfMonth === currentDay;
          const event = events.find((e) => isSameDay(new Date(e.date), cellDate));
          const colors = event ? COLOR_MAP[event.color] || COLOR_MAP.blue : null;

          const text = isCurrentDay
            ? "font-bold text-zinc-500 border-zinc-600"
            : event
              ? `${colors.text} ${colors.border}`
              : "text-zinc-500 border-zinc-700/50";

          const link = event
            ? `${colors.bg} cursor-pointer ${colors.hover}`
            : "";

          return (
            <button
              key={day}
              type="button"
              disabled={!event}
              onClick={() => event && setSelectedEvent(event)}
              className={`group relative border-1 rounded-[4px] h-[48px] md:h-[80px] w-full overflow-hidden ${insetShadow} ${text} ${link} ${!event ? "cursor-default" : ""}`}
            >
              <div className="absolute top-0 left-0 p-1 text-[12px]">{dayOfMonth}</div>
              {event && (
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-[2px] m-[3px]">
                  <img
                    className={`h-[13px] w-[13px] shrink-0 ${dropShadow}`}
                    src={`${cdn}/icons/small/${event.icon}.png`}
                    alt=""
                  />
                  <span className="text-[9px] md:text-[10px] font-bold leading-none truncate">
                    {event.name}
                  </span>
                </div>
              )}
              {isCurrentDay && !event && (
                <div className="flex items-center uppercase text-[10px] bottom-0 right-0 m-[4px] absolute">
                  <img
                    className={`h-[15px] w-[15px] ${dropShadow}`}
                    src={`${cdn}/icons/small/on.png`}
                    alt=""
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedEvent &&
        createPortal(
          <div
            className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-zinc-800/50 z-100 text-zinc-900"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className={`relative flex flex-col p-5 gap-5 w-full max-w-[375px] bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 rounded-[4px] border-1 border-zinc-500/50 drop-shadow-md ${insetShadow}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-[10px] right-[10px] cursor-pointer z-1"
                onClick={() => setSelectedEvent(null)}
              >
                <img
                  className="w-[16px] h-[16px]"
                  src={`${cdn}/icons/small/cross.png`}
                  alt=""
                />
              </button>
              <div className="flex items-center gap-2">
                <img
                  className={`h-[32px] w-[32px] ${dropShadow}`}
                  src={`${cdn}/icons/${selectedEvent.icon}.png`}
                  alt=""
                />
                <div>
                  <div className="font-bold">{selectedEvent.name}</div>
                  <div className="text-xs text-zinc-500">
                    {dateFormatter.format(new Date(selectedEvent.date))}
                  </div>
                </div>
              </div>
              {selectedEvent.description && (
                <div className="text-sm">{selectedEvent.description}</div>
              )}
              {selectedEvent.url && (
                <a
                  href={selectedEvent.url}
                  target="_blank"
                  className="flex items-center text-sm text-blue-600 hover:underline truncate"
                >
                  <img
                    className="w-[16px] h-[16px] mr-1 shrink-0"
                    src={`${cdn}/icons/small/link_go.png`}
                    alt=""
                  />
                  {selectedEvent.url}
                </a>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
