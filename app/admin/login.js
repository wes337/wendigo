"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/admin/actions";
import Link from "next/link";
import { box, input, btn, siteWidth, insetShadow } from "@/app/styles";

export default function LoginForm() {
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(formData) {
    setError(null);
    const result = await login(formData);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <div className={`mt-5 text-zinc-900 ${siteWidth}`}>
      <div className="flex items-center justify-between font-bold text-sm mb-2.5">
        Admin Login
        <Link
          href="/"
          className={`text-xs md:text-sm font-bold text-white hover:brightness-110 px-2.5 py-1.5 md:px-3 md:py-2 bg-gradient-to-bl from-[var(--t-submit-from)] via-[var(--t-submit-via)] to-[var(--t-submit-to)] border-1 border-[var(--t-submit-border)] rounded-[4px] drop-shadow-md ${insetShadow}`}
        >
          Back to Site
        </Link>
      </div>
      <form action={handleSubmit} className={box}>
        <input
          name="password"
          type="password"
          placeholder="Password"
          className={input}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className={`mr-auto ${btn}`}
        >
          Log In
        </button>
      </form>
    </div>
  );
}
