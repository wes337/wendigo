// Resizes a Shopify CDN image via its `width` query param. Pass ~2x the rendered CSS width for retina screens.
export function shopifyImage(url, width) {
  const resized = new URL(url);
  resized.searchParams.set("width", String(width));
  return resized.toString();
}
