export const cdn = "https://w-img.b-cdn.net/wendigo";

export const insetShadow =
  "shadow-[inset_0_1px_0_var(--t-inset-white),inset_-1px_0_0_var(--t-inset-white-75),inset_0_-1px_0_var(--t-inset-white-25),inset_0_10px_10px_var(--t-inset-white-50)]";

export const dropShadow =
  "drop-shadow-[2px_2px_0_black] drop-shadow-zinc-800/10";

export const siteWidth = "w-full max-w-[90vw] md:max-w-[720px]";

export const smallBox = `flex flex-col p-2.5 gap-2.5 w-full max-w-[600px] bg-gradient-to-bl from-[var(--t-panel-from)] via-[var(--t-panel-via)] to-[var(--t-panel-to)] rounded-[4px] border-1 border-[var(--t-panel-border)] drop-shadow-md ${insetShadow}`;

export const box = `flex flex-col p-5 gap-5 ${siteWidth} bg-gradient-to-bl from-[var(--t-panel-from)] via-[var(--t-panel-via)] to-[var(--t-panel-to)] rounded-[2px] border-1 border-[var(--t-panel-border)] drop-shadow-md ${insetShadow}`;

export const input = `w-full px-2.5 py-2 text-sm bg-[var(--t-input-bg)] text-[var(--t-text)] border-1 border-[var(--t-panel-border)] rounded-[2px] outline-none focus:border-[var(--t-accent)] ${insetShadow}`;

export const btn = `flex items-center justify-center cursor-pointer text-[var(--t-accent)] text-sm px-[12px] py-[8px] bg-[var(--t-btn-bg)] hover:bg-[var(--t-btn-hover)] active:bg-[var(--t-btn-hover)] border-1 border-[var(--t-panel-border)] rounded-[4px] ${insetShadow} ${dropShadow}`;

export const listRow = "flex items-center gap-2.5 px-2.5 py-2 bg-[var(--t-row-even)] odd:bg-[var(--t-row-odd)] border-1 border-[var(--t-panel-border)] rounded-[2px] shadow-sm hover:bg-[var(--t-row-hover)] active:bg-[var(--t-row-hover)]";

export const submitBtn = `w-full flex items-center justify-center cursor-pointer text-white text-sm font-bold px-[12px] py-[8px] bg-gradient-to-bl from-[var(--t-submit-from)] via-[var(--t-submit-via)] to-[var(--t-submit-to)] border-1 border-[var(--t-submit-border)] rounded-[2px] ${dropShadow}`;
