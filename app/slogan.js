"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const SLOGANS = [
  "Psychologically Helping You",
  "Really making sure this is a special moment for you",
  "Altering the price floor",
  "Pumping and dumping hard",
  "We Delete your Bitcoin",
  "Reporting you to the authorities",
  "Spamming your IP with empty packets",
  "Doubling your net worth",
  "Doubling your money",
  "Your personal bitcoin advice mentor",
  "Funneling dark money to my 3-story Philippines safehouse",
  "Having an incredible time & enjoying life's pleasures",
];

export default function Slogan() {
  const pathname = usePathname();
  const [slogan, setSlogan] = useState("");

  useEffect(() => {
    setSlogan(SLOGANS[Math.floor(Math.random() * SLOGANS.length)]);
  }, [pathname]);

  if (!slogan) return null;

  return (
    <p className="text-[12px] sm:text-[12px] md:text-[13px] font-bold text-[var(--t-text-muted)] tracking-tight italic">
      &ldquo;<span className="text-[var(--t-accent)]">{slogan}</span>&rdquo;
    </p>
  );
}
