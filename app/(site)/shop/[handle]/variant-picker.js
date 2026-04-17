"use client";

import { useState, useTransition } from "react";
import { cdn, input, submitBtn } from "@/app/styles";
import { addLine } from "@/app/(site)/shop/actions";

export default function VariantPicker({ product }) {
  const available = product.variants.filter((v) => v.availableForSale);
  const defaultVariant = available[0] || product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const isDefaultTitleOnly =
    product.variants.length === 1 && product.variants[0].title === "Default Title";

  if (product.soldOut) {
    return (
      <button
        type="button"
        disabled
        className={`${submitBtn} opacity-60 cursor-not-allowed`}
      >
        Sold Out
      </button>
    );
  }

  function handleAdd() {
    if (!variantId) return;
    setStatus(null);
    startTransition(async () => {
      try {
        const cartId = localStorage.getItem("cartId");
        const { cartId: nextCartId, cart } = await addLine(
          cartId,
          variantId,
          quantity,
        );
        if (nextCartId && nextCartId !== cartId) {
          localStorage.setItem("cartId", nextCartId);
        }
        if (cart?.id && !localStorage.getItem("cartId")) {
          localStorage.setItem("cartId", cart.id);
        }
        window.dispatchEvent(new Event("cart-updated"));
        setStatus({ ok: true, message: "Added to cart!" });
      } catch (e) {
        console.error(e);
        setStatus({ ok: false, message: "Failed to add. Try again." });
      }
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      {!isDefaultTitleOnly && (
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold">Variant</span>
          <select
            className={input}
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                {v.title}
                {!v.availableForSale ? " — Sold Out" : ""}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold">Quantity</span>
        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
          }
          className={input}
        />
      </label>
      <button
        type="button"
        onClick={handleAdd}
        disabled={isPending || !variantId}
        className={`${submitBtn} disabled:opacity-60`}
      >
        <img
          className="w-[16px] h-[16px] mr-1.5"
          src={`${cdn}/icons/small/basket_add.png`}
          alt=""
        />
        {isPending ? "Adding..." : "Add to Cart"}
      </button>
      {status && (
        <div
          className={`text-xs font-bold ${status.ok ? "text-green-700" : "text-red-600"}`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
