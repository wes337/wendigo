import Image from "next/image";
import Link from "@/app/link";
import { box } from "./styles";
import Theme from "./theme";
import "./globals.css";

const LINKS = [
  { label: "Home", href: "/", icon: "house" },
  { label: "About", href: "/about", icon: "information" },
  { label: "Calendar", href: "/calendar", icon: "calendar" },
  { label: "Shop", href: "/shop", icon: "shop" },
  { label: "Jobs", href: "/jobs", icon: "briefcase" },
];

export const metadata = {
  title: "WENDIGO CORP",
  description: "The official Wendigo Corp website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/nci3lbg.css" />
      </head>
      <body className="antialiased">
        <Theme />
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/little-knobs.png')] opacity-10 z-0" />
        <div className="relative flex flex-col min-h-screen items-center justify-center font-sans z-1">
          <div className="flex items-center justify-center gap-2.5 my-2.5 3xl:mt-auto 3xl:pt-2.5">
            <div className="h-[40px] sm:h-[52px] md:h-[80px] w-auto">
              <Image
                className="w-auto h-full object-contain drop-shadow-lg drop-shadow-zinc-500/50"
                src={"/logo.png"}
                width={938}
                height={1071}
                alt=""
              />
            </div>
            <h1 className="-mb-2 text-xl sm:text-3xl md:text-5xl font-black text-zinc-900 text-shadow-[2px_2px_0_white] whitespace-nowrap text-shadow-zinc-800/10 uppercase">
              Wendigo Corp
            </h1>
          </div>
          <div className={box}>
            <div className="flex w-full items-center justify-evenly gap-2.5 md:gap-5">
              {LINKS.map((link) => {
                return (
                  <Link key={link.label} href={link.href} icon={link.icon}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {children}
          <div className="w-full text-center py-5 text-[12px] text-zinc-500 mt-auto">
            <div className="flex items-center justify-center gap-2.5">
              <div className="text-blue-600 text-[10px] font-bold uppercase cursor-pointer hover:underline active:underline">
                Contact Us
              </div>
              <div className="text-blue-600 text-[10px] font-bold uppercase cursor-pointer hover:underline active:underline">
                Privacy Policy
              </div>
            </div>
            <div>Copyright © 2001-2026 Wendigo Corp All Rights Reserved</div>
          </div>
        </div>
      </body>
    </html>
  );
}
