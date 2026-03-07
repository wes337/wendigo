import { box, cdn, siteWidth } from "@/app/styles";

export default function Shop() {
  return (
    <div className={`mt-5 text-[var(--t-text)] ${siteWidth}`}>
      <div className="flex font-bold text-sm mb-2.5">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/shop.png`}
          alt=""
        />
        Shop
      </div>
      <div className={box}>
        <div className="flex flex-col items-center gap-2.5 py-5 text-sm text-[var(--t-text-muted)]">
          <img
            src={`${cdn}/icons/shop.png`}
            alt=""
          />
          <div className="font-bold text-[var(--t-text)]">Coming Soon</div>
          <p className="text-center">
            The shop is currently under construction. Check back later!
          </p>
        </div>
      </div>
    </div>
  );
}
