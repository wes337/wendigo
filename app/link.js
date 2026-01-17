"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { insetShadow, dropShadow } from "@/app/styles";
import Image from "next/image";

export default function Link({ href, icon, children }) {
  const pathname = usePathname();

  const active = pathname === href;
  const background = active
    ? "bg-blue-300/50 md:bg-zinc-300 hover:bg-zinc-200 active:bg-zinc-200"
    : "bg-zinc-300 hover:bg-zinc-200 active:bg-zinc-200";
  const text = active
    ? "font-bold text-blue-600 leading-none hover:text-blue-700"
    : "font-bold text-zinc-800 leading-none hover:text-zinc-600";
  const border = active
    ? "border-1 border-blue-600/50 md:border-zinc-500/75 rounded-[2px]"
    : "border-1 border-zinc-500/50 rounded-[2px]";

  return (
    <NextLink
      key={href}
      className={`flex items-center justify-center h-[56px] w-[56px] md:h-auto md:w-full md:p-2.5 md:px-5 text-md md:text-xs 3xl:text-md md:gap-2 md:justify-center text-center ${background} ${text} ${border} ${insetShadow} ${dropShadow}`}
      href={href}
    >
      <Image
        className="hidden md:inline-flex w-[16px] h-[16px] -mt-[2px]"
        src={`/icons/small/${icon}.png`}
        width={16}
        height={16}
        alt=""
        unoptimized
      />
      <Image
        className="md:hidden w-[32px] h-[32px]"
        src={`/icons/${icon}.png`}
        width={32}
        height={32}
        alt=""
        unoptimized
      />
      <div className="hidden md:inline-flex w-full">{children}</div>
    </NextLink>
  );
}
