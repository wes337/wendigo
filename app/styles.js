export const insetShadow =
  "shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_-1px_0_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.25),inset_0_10px_10px_rgba(255,255,255,0.5)]";

export const dropShadow =
  "drop-shadow-[2px_2px_0_black] drop-shadow-zinc-800/10";

export const smallBox = `flex flex-col p-2.5 gap-2.5 w-full max-w-[600px] bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 rounded-[4px] border-1 border-zinc-500/50 drop-shadow-md ${insetShadow}`;

export const box = `flex flex-col p-5 gap-5 w-full max-w-[90vw] md:max-w-[600px] bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 rounded-[2px] border-1 border-zinc-500/50 drop-shadow-md ${insetShadow}`;
