import NextLink from "next/link";
import NavLink from "@/app/link";
import Slogan from "@/app/slogan";
import { box, cdn } from "@/app/styles";

const LINKS = [
  { label: "Home", href: "/", icon: "house" },
  { label: "About", href: "/about", icon: "information" },
  { label: "Events", href: "/calendar", icon: "calendar" },
  { label: "Shop", href: "/shop", icon: "shop" },
  { label: "Contact", href: "/contact", icon: "email" },
  { label: "News", href: "/news", icon: "newspaper" },
];

export default function SiteLayout({ children }) {
  return (
    <>
      <div className="flex flex-col items-center my-2.5 3xl:mt-auto 3xl:pt-2.5">
        <div className="flex items-center justify-center gap-2.5">
          <div className="h-[40px] sm:h-[52px] md:h-[80px] w-auto">
            <img
              className="w-auto h-full object-contain drop-shadow-lg drop-shadow-zinc-500/50"
              src={`${cdn}/logo.png`}
              alt=""
            />
          </div>
          <div className="flex flex-col -mb-2">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-[var(--t-text)] text-shadow-[2px_2px_0_var(--t-heading-shadow)] whitespace-nowrap uppercase">
              Wendigo Corp
            </h1>
            <div className="hidden sm:block">
              <Slogan />
            </div>
          </div>
        </div>
        <div className="sm:hidden">
          <Slogan />
        </div>
      </div>
      <div className={box}>
        <div className="flex w-full items-center justify-evenly gap-2.5 md:gap-5">
          {LINKS.map((link) => {
            return (
              <NavLink key={link.label} href={link.href} icon={link.icon}>
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </div>
      {children}
      <div className="w-full text-center py-5 text-[12px] text-[var(--t-text-muted)] mt-auto">
        <div className="flex items-center justify-center gap-2.5">
          <NextLink href="/contact" className="text-[var(--t-accent)] text-[10px] font-bold uppercase cursor-pointer hover:underline active:underline">
            Contact Us
          </NextLink>
          <div className="text-[var(--t-accent)] text-[10px] font-bold uppercase cursor-pointer hover:underline active:underline">
            Privacy Policy
          </div>
        </div>
        <div>Copyright © 2001-2026 Wendigo Corp All Rights Reserved</div>
        <div className="text-[9px] opacity-50 uppercase">Powered by WesWare 2.1 (PRO Edition)</div>
      </div>
    </>
  );
}
