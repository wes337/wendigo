"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/admin/actions";
import { box, input, btn, siteWidth } from "@/app/styles";

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
      <div className="flex font-bold text-sm mb-2.5">Admin Login</div>
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
