"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  box,
  btn,
  cdn,
  dropShadow,
  insetShadow,
  siteWidth,
  submitBtn,
} from "@/app/styles";
import {
  fetchCart,
  removeLine,
  updateLineQuantity,
} from "@/app/(site)/shop/actions";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    const cartId = localStorage.getItem("cartId");
    const { cart } = await fetchCart(cartId);
    if (cartId && !cart) {
      localStorage.removeItem("cartId");
    }
    setCart(cart);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function handleQuantity(lineId, nextQty) {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;
    startTransition(async () => {
      const { cart } = await updateLineQuantity(cartId, lineId, nextQty);
      setCart(cart);
      window.dispatchEvent(new Event("cart-updated"));
    });
  }

  function handleRemove(lineId) {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;
    startTransition(async () => {
      const { cart } = await removeLine(cartId, lineId);
      setCart(cart);
      window.dispatchEvent(new Event("cart-updated"));
    });
  }

  const empty = !loading && (!cart || cart.items.length === 0);

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
        <div className="ml-auto flex items-center gap-1">
          <img
            className="w-[16px] h-[16px]"
            src={`${cdn}/icons/small/cart.png`}
            alt=""
          />
          Cart
        </div>
      </div>
      <div className={box}>
        {loading ? (
          <div className="text-sm text-[var(--t-text-muted)] text-center py-5">
            Loading cart...
          </div>
        ) : empty ? (
          <div className="flex flex-col items-center gap-2.5 py-5 text-sm text-[var(--t-text-muted)]">
            <img src={`${cdn}/icons/cart.png`} alt="" />
            <div className="font-bold text-[var(--t-text)]">
              Your cart is empty
            </div>
            <Link
              href="/shop"
              className={`${btn} mt-1`}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2.5 p-2 bg-[var(--t-row-even)] border-1 border-[var(--t-panel-border)] rounded-[2px] ${insetShadow}`}
                >
                  <Link
                    href={`/shop/${item.productHandle}`}
                    className={`shrink-0 w-[56px] h-[56px] bg-[var(--t-input-bg)] border-1 border-[var(--t-panel-border)] rounded-[2px] overflow-hidden ${insetShadow}`}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex flex-col flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.productHandle}`}
                      className="text-xs font-bold truncate hover:underline active:underline"
                    >
                      {item.productTitle}
                    </Link>
                    {item.variantTitle !== "Default Title" && (
                      <div className="text-[10px] text-[var(--t-text-muted)] truncate">
                        {item.variantTitle}
                      </div>
                    )}
                    <div className="text-xs text-[var(--t-accent)] font-bold">
                      {usd.format(Number(item.price))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleQuantity(item.id, item.quantity - 1)}
                      disabled={isPending}
                      className={`${btn} !px-2 !py-1 text-xs disabled:opacity-60`}
                    >
                      −
                    </button>
                    <span className="w-[24px] text-center text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      disabled={isPending}
                      className={`${btn} !px-2 !py-1 text-xs disabled:opacity-60`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending}
                      title="Remove"
                      className={`${btn} !px-1.5 !py-1 ml-1 disabled:opacity-60`}
                    >
                      <img
                        className="w-[12px] h-[12px]"
                        src={`${cdn}/icons/small/cross.png`}
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-[var(--t-panel-border)] drop-shadow-md" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">Subtotal</span>
              <span className="font-bold text-[var(--t-accent)]">
                {usd.format(Number(cart.subtotal))}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className={submitBtn}
            >
              <img
                className="w-[16px] h-[16px] mr-1.5"
                src={`${cdn}/icons/small/creditcards.png`}
                alt=""
              />
              Proceed to Checkout
            </a>
            <div className="text-[10px] text-[var(--t-text-muted)] text-center">
              Shipping and taxes calculated at checkout.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
