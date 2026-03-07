"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cdn, insetShadow, dropShadow } from "@/app/styles";

export default function AdminLink({ href, icon, children }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  const background = active
    ? "bg-blue-300/50 md:bg-zinc-300"
    : "bg-zinc-300 hover:bg-zinc-200 active:bg-zinc-200";
  const text = active
    ? "font-bold text-blue-600 leading-none"
    : "font-bold text-zinc-800 leading-none hover:text-zinc-600";
  const border = active
    ? "border-1 border-blue-600/50 md:border-zinc-500/75 rounded-[2px]"
    : "border-1 border-zinc-500/50 rounded-[2px]";

  return (
    <NextLink
      href={href}
      className={`flex items-center justify-center h-[56px] w-[56px] md:h-auto md:w-full md:p-2.5 md:px-5 md:gap-1.5 text-xs md:text-sm ${background} ${text} ${border} ${insetShadow} ${dropShadow}`}
    >
      {icon && (
        <>
          <img
            className="hidden md:inline-flex w-[16px] h-[16px]"
            src={`${cdn}/icons/small/${icon}.png`}
            alt=""
          />
          <img
            className="md:hidden w-[32px] h-[32px]"
            src={`${cdn}/icons/${icon}.png`}
            alt=""
          />
        </>
      )}
      <span className="hidden md:inline-flex">{children}</span>
    </NextLink>
  );
}
