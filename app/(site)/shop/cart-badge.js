"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cdn, dropShadow, insetShadow } from "@/app/styles";
import { fetchCart } from "@/app/(site)/shop/actions";

export default function CartBadge() {
  const [count, setCount] = useState(null);

  const refresh = useCallback(async () => {
    const cartId = localStorage.getItem("cartId");
    const { cart } = await fetchCart(cartId);
    if (cartId && !cart) {
      localStorage.removeItem("cartId");
    }
    setCount(cart?.count ?? 0);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("cart-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("cart-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  return (
    <Link
      href="/shop/cart"
      className={`ml-auto flex items-center gap-1 px-2 py-1 text-xs font-bold text-[var(--t-accent)] bg-[var(--t-btn-bg)] hover:bg-[var(--t-btn-hover)] active:bg-[var(--t-btn-hover)] border-1 border-[var(--t-panel-border)] rounded-[2px] cursor-pointer ${insetShadow} ${dropShadow}`}
    >
      <img
        className="w-[16px] h-[16px]"
        src={`${cdn}/icons/small/cart.png`}
        alt=""
      />
      <span>Cart ({count ?? 0})</span>
    </Link>
  );
}
