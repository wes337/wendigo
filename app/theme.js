"use client";

import { useState, useEffect, useRef } from "react";
import { cdn, dropShadow, insetShadow } from "@/app/styles";
import { THEMES } from "@/app/themes";

function applyTheme(theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
}

export default function Theme() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("classic");
  const dialogRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("wendigo-theme");
    if (saved) {
      const theme = THEMES.find((t) => t.id === saved);
      if (theme) {
        setActiveId(saved);
        applyTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function selectTheme(theme) {
    setActiveId(theme.id);
    applyTheme(theme);
    localStorage.setItem("wendigo-theme", theme.id);
    setOpen(false);
  }

  return (
    <div className="z-5 absolute top-0 right-0 m-2 md:m-5" ref={dialogRef}>
      <div
        className={`flex items-center bg-gradient-to-bl from-[var(--t-panel-from)] via-[var(--t-panel-via)] to-[var(--t-panel-to)] rounded-[4px] border-1 border-[var(--t-panel-border)] drop-shadow-md ${insetShadow}`}
      >
        <button
          className={`relative flex items-center justify-center cursor-pointer ${dropShadow}`}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="hidden md:flex">
            <img
              className="w-full h-full p-1"
              src={`${cdn}/icons/palette.png`}
              alt="Theme"
            />
          </div>
          <div className="flex md:hidden">
            <img
              className="w-full h-full p-1"
              src={`${cdn}/icons/small/palette.png`}
              alt="Theme"
            />
          </div>
        </button>
      </div>
      {open && (
        <div
          className={`absolute top-full right-0 mt-1 w-[200px] flex flex-col bg-gradient-to-bl from-[var(--t-panel-from)] via-[var(--t-panel-via)] to-[var(--t-panel-to)] rounded-[4px] border-1 border-[var(--t-panel-border)] drop-shadow-lg ${insetShadow}`}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase text-[var(--t-text-muted)] border-b border-[var(--t-panel-border)]">
            Theme
          </div>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              className={`flex items-center gap-2.5 px-2.5 py-2 text-left cursor-pointer hover:bg-[var(--t-row-hover)] ${
                activeId === theme.id
                  ? "bg-[var(--t-row-hover)] text-[var(--t-accent)] font-bold"
                  : "text-[var(--t-text)]"
              }`}
              onClick={() => selectTheme(theme)}
            >
              <div className="flex gap-1">
                {theme.preview.map((color, i) => (
                  <div
                    key={i}
                    className={`w-[18px] h-[18px] rounded-[2px] border-1 border-[var(--t-panel-border)] ${insetShadow}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs">{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
