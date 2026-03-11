import Link from "next/link";
import { isAuthed } from "@/app/admin/auth";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/app/admin/nav";
import LoginForm from "@/app/admin/login";
import { insetShadow } from "@/app/styles";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  if (!(await isAuthed())) return <LoginForm />;

  return (
    <>
      <div className="z-5 fixed top-0 left-0 m-2 flex gap-2 md:absolute md:top-[24px] md:right-0 md:left-auto md:m-0 md:mr-18">
        <Link
          href="/"
          className={`flex items-center justify-center text-xs md:text-sm font-bold text-white leading-none hover:brightness-110 px-2.5 py-1.5 md:px-3 md:py-2 bg-gradient-to-bl from-[var(--t-submit-from)] via-[var(--t-submit-via)] to-[var(--t-submit-to)] border-1 border-[var(--t-submit-border)] rounded-[4px] drop-shadow-md ${insetShadow}`}
        >
          Back to Site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className={`flex items-center justify-center cursor-pointer text-xs md:text-sm font-bold text-zinc-800 leading-none hover:text-zinc-600 px-2.5 py-1.5 md:px-3 md:py-2 bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 border-1 border-zinc-500/50 rounded-[4px] drop-shadow-md ${insetShadow}`}
          >
            Log Out
          </button>
        </form>
      </div>
      <AdminNav />
      {children}
    </>
  );
}
