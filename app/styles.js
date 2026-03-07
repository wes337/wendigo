export const cdn = "https://w-img.b-cdn.net/wendigo";

export const insetShadow =
  "shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_-1px_0_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.25),inset_0_10px_10px_rgba(255,255,255,0.5)]";

export const dropShadow =
  "drop-shadow-[2px_2px_0_black] drop-shadow-zinc-800/10";

export const siteWidth = "w-full max-w-[90vw] md:max-w-[720px]";

export const smallBox = `flex flex-col p-2.5 gap-2.5 w-full max-w-[600px] bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 rounded-[4px] border-1 border-zinc-500/50 drop-shadow-md ${insetShadow}`;

export const box = `flex flex-col p-5 gap-5 ${siteWidth} bg-gradient-to-bl from-zinc-300 via-zinc-200 to-zinc-300 rounded-[2px] border-1 border-zinc-500/50 drop-shadow-md ${insetShadow}`;

export const input = `w-full px-2.5 py-2 text-sm bg-zinc-100 border-1 border-zinc-500/50 rounded-[2px] outline-none focus:border-blue-600/75 ${insetShadow}`;

export const btn = `flex items-center justify-center cursor-pointer text-blue-600 text-sm px-[12px] py-[8px] bg-zinc-300 hover:bg-zinc-200 active:bg-zinc-200 border-1 border-zinc-500/50 rounded-[4px] ${insetShadow} ${dropShadow}`;

export const listRow = "flex items-center gap-2.5 px-2.5 py-2 bg-zinc-200 odd:bg-zinc-100 border-1 border-zinc-400/75 rounded-[2px] shadow-sm hover:bg-zinc-50 active:bg-zinc-50";

export const submitBtn = `w-full flex items-center justify-center cursor-pointer text-white text-sm font-bold px-[12px] py-[8px] bg-gradient-to-bl from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 active:from-blue-600 active:via-blue-700 active:to-blue-800 border-1 border-blue-700 rounded-[2px] ${dropShadow}`;
