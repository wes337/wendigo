"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getSlogans } from "@/app/(site)/actions";

export default function Slogan() {
  const pathname = usePathname();
  const [slogans, setSlogans] = useState([]);
  const [slogan, setSlogan] = useState("");

  useEffect(() => {
    getSlogans().then(setSlogans);
  }, []);

  useEffect(() => {
    if (slogans.length === 0) return;
    setSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
  }, [pathname, slogans]);

  if (!slogan) return null;

  return (
    <p className="text-[12px] sm:text-[12px] md:text-[13px] font-bold text-[var(--t-text-muted)] tracking-tight italic">
      &ldquo;<span className="text-[var(--t-accent)]">{slogan}</span>&rdquo;
    </p>
  );
}
