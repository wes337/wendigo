"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cdn, insetShadow, dropShadow } from "@/app/styles";

export default function Link({ href, icon, children, isLast }) {
  const pathname = usePathname();

  const active = pathname === href;

  const background = active
    ? "bg-[var(--t-btn-hover)] hover:bg-[var(--t-btn-hover)] active:bg-[var(--t-btn-hover)]"
    : "bg-[var(--t-btn-bg)] hover:bg-[var(--t-btn-hover)] active:bg-[var(--t-btn-hover)]";
  const deskText = active
    ? "font-bold text-[var(--t-accent)] leading-none hover:text-[var(--t-accent-hover)]"
    : "font-bold text-[var(--t-text)] leading-none hover:text-[var(--t-text-muted)]";
  const border = active
    ? "border-1 border-[var(--t-accent)]/50 rounded-[2px]"
    : "border-1 border-[var(--t-panel-border)] rounded-[2px]";

  // Mobile: BeOS/classic Mac beveled buttons
  const mobActive = active
    ? "text-[var(--t-accent)] font-bold bg-[var(--t-btn-bg)] shadow-[inset_1px_1px_0_rgba(0,0,0,0.25),inset_-1px_-1px_0_rgba(255,255,255,0.6)]"
    : "text-zinc-700 font-bold bg-[var(--t-btn-bg)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.6),inset_-1px_-1px_0_rgba(0,0,0,0.15)]";

  return (
    <>
      {/* Mobile: beveled tab in bottom bar */}
      <NextLink
        href={href}
        className={`md:hidden flex flex-col items-center justify-center gap-0.5 py-2 px-1 flex-1 text-[10px] leading-none ${isLast ? "" : "border-r border-[var(--t-panel-border)]"} ${mobActive}`}
      >
        <img
          className="w-[24px] h-[24px]"
          src={`${cdn}/icons/${icon}.png`}
          alt=""
        />
        <span>{children}</span>
      </NextLink>
      {/* Desktop: button style */}
      <NextLink
        href={href}
        className={`hidden md:flex items-center justify-center w-full p-2.5 px-5 gap-2 text-xs 3xl:text-md text-center ${background} ${deskText} ${border} ${insetShadow} ${dropShadow}`}
      >
        <img
          className="w-[16px] h-[16px] -mt-[2px]"
          src={`${cdn}/icons/small/${icon}.png`}
          alt=""
        />
        <div className="w-full">{children}</div>
      </NextLink>
    </>
  );
}
