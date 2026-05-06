"use client";

import { useActionState } from "react";
import { insetShadow, input } from "@/app/styles";
import { createSlogan } from "@/app/admin/slogans/actions";

export default function SloganForm() {
  const [state, action, isPending] = useActionState(createSlogan, null);

  return (
    <form action={action} className="flex gap-2">
      <input
        name="text"
        placeholder="New slogan..."
        required
        maxLength={300}
        className={`${input} flex-1`}
      />
      <button
        type="submit"
        disabled={isPending}
        className={`flex items-center justify-center text-xs md:text-sm font-bold text-white leading-none hover:brightness-110 px-2.5 py-1.5 md:px-3 md:py-2 bg-gradient-to-bl from-[var(--t-submit-from)] via-[var(--t-submit-via)] to-[var(--t-submit-to)] border-1 border-[var(--t-submit-border)] rounded-[4px] drop-shadow-md cursor-pointer whitespace-nowrap w-[80px] disabled:opacity-60 ${insetShadow}`}
      >
        {isPending ? "Adding..." : "Add"}
      </button>
      {state?.error && (
        <div className="text-xs text-red-600 font-bold">{state.error}</div>
      )}
    </form>
  );
}
