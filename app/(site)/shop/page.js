import Link from "next/link";
import { box, cdn, dropShadow, insetShadow, siteWidth, smallBox } from "@/app/styles";
import Shopify from "@/lib/shopify";
import CartBadge from "@/app/(site)/shop/cart-badge";

export const revalidate = 120;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function Shop() {
  const { results: products } = await Shopify.getProducts();

  return (
    <div className={`mt-5 text-[var(--t-text)] ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        <img
          className="w-[16px] h-[16px] mr-1"
          src={`${cdn}/icons/small/shop.png`}
          alt=""
        />
        Shop
        <CartBadge />
      </div>
      <div className={box}>
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-5 text-sm text-[var(--t-text-muted)]">
            <img src={`${cdn}/icons/shop.png`} alt="" />
            <div className="font-bold text-[var(--t-text)]">No Products Yet</div>
            <p className="text-center">Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.handle}`}
                className={`${smallBox} !p-2 gap-1.5 hover:bg-[var(--t-row-hover)] active:bg-[var(--t-row-hover)] cursor-pointer`}
              >
                <div
                  className={`relative aspect-square w-full bg-[var(--t-input-bg)] border-1 border-[var(--t-panel-border)] rounded-[2px] overflow-hidden ${insetShadow}`}
                >
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className={`w-full h-full object-cover ${product.soldOut ? "opacity-50" : ""}`}
                    />
                  ) : null}
                  {product.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`px-2 py-0.5 text-[10px] font-black uppercase text-white bg-red-600 border-1 border-red-800 rounded-[2px] ${dropShadow}`}
                      >
                        Sold Out
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-2">
                  {product.title}
                </div>
                <div className="text-xs text-[var(--t-accent)] font-bold">
                  {usd.format(Number(product.price))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
