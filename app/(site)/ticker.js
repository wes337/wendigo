"use client";

import Link from "next/link";
import { cdn, dropShadow, insetShadow } from "@/app/styles";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function EventItem({ event }) {
  return (
    <Link
      href="/calendar"
      className="flex items-center gap-1.5 shrink-0 group"
    >
      <img
        className={`w-[16px] h-[16px] ${dropShadow}`}
        src={`${cdn}/icons/small/${event.icon}.png`}
        alt=""
      />
      <span className="text-xs font-bold text-[var(--t-accent)] group-hover:text-[var(--t-accent-hover)] uppercase tracking-wide">
        {event.name}
      </span>
      <span className="text-[10px] text-[var(--t-text-muted)] font-bold">
        {dateFormatter.format(new Date(event.date))}
      </span>
      <span className="text-[var(--t-text-muted)] text-xs ml-2">|</span>
    </Link>
  );
}

export default function Ticker({ events }) {
  if (events.length === 0) return null;

  const wrapper = `relative ${insetShadow} w-full max-w-[90vw] md:max-w-[720px] overflow-hidden bg-gradient-to-bl from-[var(--t-panel-from)] via-[var(--t-panel-via)] to-[var(--t-panel-to)] border-1 border-[var(--t-panel-border)] rounded-[2px]`;

  if (events.length === 1) {
    return (
      <div className={wrapper}>
        <div className="flex items-center justify-center py-2 px-4 whitespace-nowrap">
          <EventItem event={events[0]} />
        </div>
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--t-panel-via)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--t-panel-via)] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-ticker whitespace-nowrap">
        <div className="flex items-center gap-6 py-2 pr-6 shrink-0">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
        <div className="flex items-center gap-6 py-2 pr-6 shrink-0" aria-hidden="true">
          {events.map((event) => (
            <EventItem key={`dup-${event.id}`} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
