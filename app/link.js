"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cdn, insetShadow, dropShadow } from "@/app/styles";

export default function Link({ href, icon, children }) {
  const pathname = usePathname();

  const active = pathname === href;
  const background = active
    ? "bg-[var(--t-btn-hover)] md:bg-[var(--t-btn-bg)] hover:bg-[var(--t-btn-hover)] active:bg-[var(--t-btn-hover)]"
    : "bg-[var(--t-btn-bg)] hover:bg-[var(--t-btn-hover)] active:bg-[var(--t-btn-hover)]";
  const text = active
    ? "font-bold text-[var(--t-accent)] leading-none hover:text-[var(--t-accent-hover)]"
    : "font-bold text-[var(--t-text)] leading-none hover:text-[var(--t-text-muted)]";
  const border = active
    ? "border-1 border-[var(--t-accent)]/50 md:border-[var(--t-panel-border)] rounded-[2px]"
    : "border-1 border-[var(--t-panel-border)] rounded-[2px]";

  return (
    <NextLink
      key={href}
      className={`flex items-center justify-center h-[56px] w-[56px] md:h-auto md:w-full md:p-2.5 md:px-5 text-md md:text-xs 3xl:text-md md:gap-2 md:justify-center text-center ${background} ${text} ${border} ${insetShadow} ${dropShadow}`}
      href={href}
    >
      <img
        className="hidden md:inline-flex w-[16px] h-[16px] -mt-[2px]"
        src={`${cdn}/icons/small/${icon}.png`}
        alt=""
      />
      <img
        className="md:hidden w-[32px] h-[32px]"
        src={`${cdn}/icons/${icon}.png`}
        alt=""
      />
      <div className="hidden md:inline-flex w-full">{children}</div>
    </NextLink>
  );
}
