"use server";

import Shopify from "@/lib/shopify";

function normalizeCart(cart) {
  if (!cart) return null;

  const items = (cart.lines?.edges || []).map(({ node }) => ({
    id: node.id,
    quantity: node.quantity,
    variantId: node.merchandise.id,
    variantTitle: node.merchandise.title,
    productTitle: node.merchandise.product.title,
    productHandle: node.merchandise.product.handle,
    price: node.merchandise.price.amount,
    currencyCode: node.merchandise.price.currencyCode,
    image: node.merchandise.image?.url || "",
    digital: !node.merchandise.requiresShipping,
  }));

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    subtotal: cart.estimatedCost?.subtotalAmount?.amount || "0",
    total: cart.estimatedCost?.totalAmount?.amount || "0",
    currencyCode:
      cart.estimatedCost?.subtotalAmount?.currencyCode || "USD",
    items,
    count,
  };
}

export async function ensureCart(cartId) {
  if (cartId) {
    const valid = await Shopify.isCartValid(cartId);
    if (valid) return { cartId };
  }
  const cart = await Shopify.createCart();
  return { cartId: cart.id };
}

export async function fetchCart(cartId) {
  if (!cartId) return { cart: null };
  const valid = await Shopify.isCartValid(cartId);
  if (!valid) return { cart: null };
  const cart = await Shopify.getCart(cartId);
  return { cart: normalizeCart(cart) };
}

export async function addLine(cartId, variantId, quantity = 1) {
  const { cartId: id } = await ensureCart(cartId);
  const cart = await Shopify.addToCart(id, [
    { merchandiseId: variantId, quantity },
  ]);
  return { cartId: id, cart: normalizeCart(cart) };
}

export async function removeLine(cartId, lineId) {
  const cart = await Shopify.removeFromCart(cartId, [lineId]);
  return { cart: normalizeCart(cart) };
}

export async function updateLineQuantity(cartId, lineId, quantity) {
  if (quantity <= 0) {
    const cart = await Shopify.removeFromCart(cartId, [lineId]);
    return { cart: normalizeCart(cart) };
  }
  const cart = await Shopify.updateQuantity(cartId, lineId, quantity);
  return { cart: normalizeCart(cart) };
}
