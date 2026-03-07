"use client";

import { useState, useMemo, useActionState } from "react";
import { createPortal } from "react-dom";
import { box, cdn, input, insetShadow, submitBtn } from "@/app/styles";
import { ICONS } from "@/app/admin/calendar/icons";

const COLORS = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  zinc: "bg-zinc-500",
};

const MAX_VISIBLE = 100;

export default function EventForm({ action, event }) {
  const [state, formAction] = useActionState(action, null);
  const [color, setColor] = useState(event?.color || "blue");
  const [icon, setIcon] = useState(event?.icon || "events");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const q = iconSearch.toLowerCase().replace(/\s+/g, "_");
    const matches = q ? ICONS.filter((i) => i.includes(q)) : ICONS;
    return matches.slice(0, MAX_VISIBLE);
  }, [iconSearch]);

  return (
    <>
      <form action={formAction} className={box}>
        {event && <input type="hidden" name="id" value={event.id} />}
        <input type="hidden" name="icon" value={icon} />
        <input type="hidden" name="color" value={color} />

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Name</span>
          <input
            name="name"
            defaultValue={event?.name}
            required
            className={input}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Description (optional)</span>
          <textarea
            name="description"
            defaultValue={event?.description}
            rows={3}
            className={`${input} resize-y`}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Date</span>
          <input
            name="date"
            type="date"
            defaultValue={event?.date ? new Date(event.date).toISOString().split("T")[0] : ""}
            required
            className={input}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">URL (optional)</span>
          <input
            name="url"
            type="url"
            defaultValue={event?.url}
            placeholder="https://..."
            className={input}
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold">Icon</span>
          <button
            type="button"
            onClick={() => setIconPickerOpen(true)}
            className={`flex items-center gap-2 w-full px-2.5 py-2 text-sm bg-zinc-100 border-1 border-zinc-500/50 rounded-[2px] cursor-pointer hover:border-blue-600/75 ${insetShadow}`}
          >
            <img
              src={`${cdn}/icons/small/${icon}.png`}
              alt=""
            />
            <span className="text-zinc-700">{icon}</span>
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold">Color</span>
          <div className="flex gap-2">
            {Object.entries(COLORS).map(([name, bg]) => (
              <button
                key={name}
                type="button"
                onClick={() => setColor(name)}
                className={`w-[32px] h-[32px] rounded-[2px] ${bg} border-1 ${color === name ? "border-blue-600 ring-1 ring-blue-600" : "border-zinc-500/50"} cursor-pointer ${insetShadow}`}
              />
            ))}
          </div>
        </div>

        {state?.error && (
          <div className="text-red-600 text-sm">{state.error}</div>
        )}

        <button type="submit" className={submitBtn}>
          {event ? "Update" : "Create"} Event
        </button>
      </form>

      {iconPickerOpen &&
        createPortal(
          <div
            className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-zinc-800/50 z-100 text-zinc-900"
            onClick={() => setIconPickerOpen(false)}
          >
            <div
              className={`relative flex flex-col gap-2.5 p-5 w-full max-w-[500px] max-h-[80vh] bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 rounded-[2px] border-1 border-zinc-500/50 drop-shadow-md ${insetShadow}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-[10px] right-[10px] cursor-pointer z-1"
                onClick={() => setIconPickerOpen(false)}
              >
                <img
                  className="w-[16px] h-[16px]"
                  src={`${cdn}/icons/small/cross.png`}
                  alt=""
                />
              </button>
              <div className="font-bold text-sm">Select Icon</div>
              <input
                type="text"
                placeholder="Search icons..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                autoFocus
                className={input}
              />
              <div className="overflow-y-auto grid grid-cols-8 gap-1">
                {filteredIcons.map((name) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      setIcon(name);
                      setIconPickerOpen(false);
                      setIconSearch("");
                    }}
                    className={`flex items-center justify-center p-1.5 rounded-[2px] border-1 cursor-pointer ${icon === name ? "border-blue-600 bg-blue-100/50" : "border-transparent hover:border-zinc-500/50 hover:bg-zinc-100/50"}`}
                  >
                    <img
                      src={`${cdn}/icons/small/${name}.png`}
                      alt={name}
                    />
                  </button>
                ))}
              </div>
              {filteredIcons.length === MAX_VISIBLE && (
                <div className="text-xs text-zinc-500 text-center">
                  Showing first {MAX_VISIBLE} results. Type to narrow down.
                </div>
              )}
              {filteredIcons.length === 0 && (
                <div className="text-sm text-zinc-500 text-center">No icons found.</div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
