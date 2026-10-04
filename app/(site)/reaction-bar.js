"use client";

import { startTransition, useOptimistic } from "react";
import { cdn } from "@/app/styles";
import { REACTIONS } from "@/app/(site)/reactions";
import { toggleReaction } from "@/app/(site)/actions";

// Row of reaction toggles for a post. `reactions` maps reaction id -> { count, mine }.
export default function ReactionBar({ postId, reactions }) {
  // Mirrors toggleReaction: the visitor holds at most one reaction, so picking a new one drops the old
  const [optimistic, toggleOptimistic] = useOptimistic(reactions, (state, id) => {
    const next = {};
    for (const [key, { count, mine }] of Object.entries(state)) {
      next[key] = mine ? { count: count - 1, mine: false } : { count, mine };
    }
    if (!state[id]?.mine) {
      next[id] = { count: (next[id]?.count ?? 0) + 1, mine: true };
    }
    return next;
  });

  return (
    <div className="flex items-center gap-2 md:gap-2.5 ml-auto">
      {REACTIONS.map(({ id, label }) => {
        const { count = 0, mine = false } = optimistic[id] ?? {};
        return (
          <button
            key={id}
            type="button"
            title={label}
            aria-pressed={mine}
            onClick={() =>
              startTransition(async () => {
                toggleOptimistic(id);
                await toggleReaction(postId, id);
              })
            }
            className={`flex items-center gap-1 text-xs font-bold cursor-pointer ${
              mine
                ? "text-[var(--t-accent)]"
                : "text-[var(--t-text-muted)] opacity-60 hover:opacity-100"
            }`}
          >
            <img className="w-[16px] h-[16px]" src={`${cdn}/icons/small/${id}.png`} alt={label} />
            {count > 0 && count}
          </button>
        );
      })}
    </div>
  );
}
