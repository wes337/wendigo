import { box } from "@/app/styles";
import AdminLink from "@/app/admin/link";

const LINKS = [
  { label: "Posts", href: "/admin/posts", icon: "newspaper" },
  { label: "About", href: "/admin/about", icon: "information" },
  { label: "Files", href: "/admin/files", icon: "folder" },
  { label: "Events", href: "/admin/calendar", icon: "calendar" },
  { label: "News", href: "/admin/news", icon: "newspaper" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "email" },
];

export default function AdminNav() {
  return (
    <>
      <div className="flex items-center justify-center gap-2.5 my-2.5">
        <h1 className="text-xl md:text-3xl font-black text-zinc-900 text-shadow-[2px_2px_0_white] text-shadow-zinc-800/10 uppercase">
          Admin
        </h1>
      </div>
      <div className={box}>
        <div className="flex w-full items-center justify-evenly gap-2.5 md:gap-2">
          {LINKS.map((link) => (
            <AdminLink key={link.href} href={link.href} icon={link.icon}>
              {link.label}
            </AdminLink>
          ))}
        </div>
      </div>
    </>
  );
}
