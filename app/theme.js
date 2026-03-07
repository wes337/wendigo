"use client";

import { useState, useEffect } from "react";
import { cdn, dropShadow, insetShadow } from "@/app/styles";

export default function Theme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div
      className={`z-5 absolute top-0 right-0 m-2 md:m-5 flex items-center bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 rounded-[4px] border-1 border-zinc-500/50 drop-shadow-md ${insetShadow}`}
    >
      <button
        className={`relative flex items-center justify-center cursor-pointer ${dropShadow}`}
        onClick={() => {
          setTheme((theme) => (theme === "light" ? "dark" : "light"));
        }}
      >
        <div className="hidden md:flex">
          <img
            className={`w-full h-full p-1 ${theme === "light" ? "opacity-100" : "opacity-0"}`}
            src={`${cdn}/icons/weather_sun.png`}
            alt=""
          />
          <img
            className={`absolute top-0 left-0 w-full h-full p-1 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
            src={`${cdn}/icons/weather_moon_half.png`}
            alt=""
          />
        </div>
        <div className="flex md:hidden">
          <img
            className={`w-full h-full p-1 ${theme === "light" ? "opacity-100" : "opacity-0"}`}
            src={`${cdn}/icons/small/weather_sun.png`}
            alt=""
          />
          <img
            className={`absolute top-0 left-0 w-full h-full p-1 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
            src={`${cdn}/icons/small/weather_moon_half.png`}
            alt=""
          />
        </div>
      </button>
    </div>
  );
}
