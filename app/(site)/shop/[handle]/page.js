import Link from "next/link";
import { notFound } from "next/navigation";
import { box, cdn, dropShadow, insetShadow, siteWidth } from "@/app/styles";
import Shopify from "@/lib/shopify";
import CartBadge from "@/app/(site)/shop/cart-badge";
import VariantPicker from "@/app/(site)/shop/[handle]/variant-picker";

export const revalidate = 60;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await Shopify.getProduct(handle);

  if (!product) notFound();

  return (
    <div className={`mt-5 text-[var(--t-text)] ${siteWidth}`}>
      <div className="flex items-center font-bold text-sm mb-2.5">
        <Link
          href="/shop"
          className="flex items-center gap-1 hover:underline active:underline"
        >
          <img
            className="w-[16px] h-[16px]"
            src={`${cdn}/icons/small/arrow_left.png`}
            alt=""
          />
          Shop
        </Link>
        <CartBadge />
      </div>
      <div className={box}>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col gap-2.5 w-full md:w-1/2">
            <div
              className={`relative aspect-square w-full bg-[var(--t-input-bg)] border-1 border-[var(--t-panel-border)] rounded-[2px] overflow-hidden ${insetShadow}`}
            >
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className={`w-full h-full object-contain ${product.soldOut ? "opacity-50" : ""}`}
                />
              ) : null}
              {product.soldOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`px-2 py-0.5 text-xs font-black uppercase text-white bg-red-600 border-1 border-red-800 rounded-[2px] ${dropShadow}`}
                  >
                    Sold Out
                  </div>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5">
                {product.images.slice(1).map((src, i) => (
                  <div
                    key={i}
                    className={`aspect-square bg-[var(--t-input-bg)] border-1 border-[var(--t-panel-border)] rounded-[2px] overflow-hidden ${insetShadow}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2.5 w-full md:w-1/2">
            <div className="text-xl font-bold">{product.title}</div>
            <div className="text-lg text-[var(--t-accent)] font-bold">
              {usd.format(Number(product.price))}
            </div>
            {product.descriptionHtml && (
              <div
                className="about-prose text-sm"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}
            <VariantPicker product={product} digital={product.digital} />
            {product.sizeChart?.value && (
              <details className={`${insetShadow} border-1 border-[var(--t-panel-border)] rounded-[2px] bg-[var(--t-input-bg)]`}>
                <summary className="flex items-center gap-1 px-2.5 py-2 cursor-pointer text-xs font-bold">
                  <img
                    className="w-[16px] h-[16px]"
                    src={`${cdn}/icons/small/ruler.png`}
                    alt=""
                  />
                  Size Chart
                </summary>
                <div className="px-2.5 py-2 border-t-1 border-[var(--t-panel-border)] text-xs whitespace-pre-wrap">
                  {product.sizeChart.value}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
