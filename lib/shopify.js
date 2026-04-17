import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import Cache from "@/lib/cache";

export default class Shopify {
  static client;
  static domain = "wendigo-corp.myshopify.com";
  static storefrontAccessToken = "17deaee990b47bad9cfe8e9ca487cebc";

  static {
    Shopify.client = createStorefrontApiClient({
      apiVersion: "2025-10",
      storeDomain: Shopify.domain,
      publicAccessToken: Shopify.storefrontAccessToken,
    });
  }

  static async getProduct(handle) {
    const cachedProduct = await Cache.getItem(`product:${handle}`);

    if (cachedProduct) {
      return cachedProduct;
    }

    const { data } = await Shopify.client.request(
      `query ProductQuery($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          sizeChart: metafield(namespace: "custom", key: "size_guide") {
            value
            type
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }`,
      {
        variables: { handle },
      },
    );

    if (!data.product) {
      return null;
    }

    const product = {
      id: data.product.id,
      handle: data.product.handle,
      title: data.product.title,
      description: data.product.description,
      descriptionHtml: data.product.descriptionHtml,
      images:
        data.product.images?.edges?.length > 0
          ? data.product.images.edges.map(({ node }) => node.url || "")
          : [],
      soldOut: !data.product.variants.edges.some(
        ({ node }) => node.availableForSale,
      ),
      price: data.product.priceRange.minVariantPrice.amount,
      currencyCode: data.product.priceRange.minVariantPrice.currencyCode,
      variants:
        data.product.variants?.edges?.length > 0
          ? data.product.variants.edges.map(({ node }) => ({
              id: node.id,
              title: node.title,
              availableForSale: node.availableForSale,
            }))
          : [],
    };

    if (product) {
      Cache.setItem(`product:${handle}`, product, 60);
    }

    return product;
  }

  static async getProducts(first = 100, after = null) {
    const cachedProducts = await Cache.getItem(
      `products:${first}${after ? `:${after}` : ""}`,
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const { data } = await Shopify.client.request(
      `query ProductsQuery($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              collections(first: 250) {
                edges {
                  node {
                    id
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { first, after },
      },
    );

    const results = data.products.edges
      .map(({ node }) => {
        const images =
          node.images?.edges?.length > 0
            ? node.images.edges.map(({ node }) => node.url || "")
            : [];

        const soldOut = !node.variants.edges.some(
          ({ node }) => node.availableForSale,
        );

        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          descriptionHtml: node.descriptionHtml,
          images,
          price: node.priceRange.minVariantPrice.amount,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          variants:
            node.variants?.edges?.length > 0
              ? node.variants.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  availableForSale: node.availableForSale,
                  price: node.price.amount,
                }))
              : [],
          soldOut,
        };
      })
      .filter(Boolean);

    const hasMore = data.products.pageInfo?.hasNextPage || false;

    const products = {
      results,
      hasMore,
    };

    if (products && products.results && products.results.length > 0) {
      Cache.setItem(
        `products:${first}${after ? `:${after}` : ""}`,
        products,
        120,
      );
    }

    return products;
  }

  static async getCart(cartId) {
    const { data } = await Shopify.client.request(
      `query CartQuery($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { cartId },
      },
    );

    return data.cart;
  }

  static async isCartValid(cartId) {
    try {
      const { data } = await Shopify.client.request(
        `query CartQuery($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
          }
        }`,
        {
          variables: { cartId },
        },
      );

      return !!(data && data.cart && data.cart.id);
    } catch {
      return false;
    }
  }

  static async createCart() {
    const { data } = await Shopify.client.request(`
      mutation CreateCart {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `);

    return data.cartCreate.cart;
  }

  static async addToCart(cartId, lines) {
    const { data } = await Shopify.client.request(
      `mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lines },
      },
    );

    return data.cartLinesAdd.cart;
  }

  static async removeFromCart(cartId, lineIds) {
    const { data } = await Shopify.client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lineIds },
      },
    );

    return data.cartLinesRemove.cart;
  }

  static async updateQuantity(cartId, lineId, quantity) {
    const { data } = await Shopify.client.request(
      `mutation UpdateCartLineQuantity($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          cartId,
          lines: [{ id: lineId, quantity }],
        },
      },
    );

    return data.cartLinesUpdate.cart;
  }

  static async emptyCart(cart) {
    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return;
    }

    const lineIds = cart.lines.edges.map((edge) => edge.node.id);

    await Shopify.client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId: cart.id, lineIds },
      },
    );
  }

  static async getCartItems(cartId) {
    const cart = await Shopify.getCart(cartId);

    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return [];
    }

    return cart.lines.edges.map(({ node }) => {
      const merchandise = node.merchandise;

      return {
        id: node.id,
        quantity: node.quantity,
        variantId: merchandise.id,
        variantTitle: merchandise.title,
        productTitle: merchandise.product.title,
        productHandle: merchandise.product.handle,
        price: merchandise.price.amount,
        image: merchandise.image?.url || "",
      };
    });
  }

  static async getCollectionProducts(collectionId, first = 100, after = null) {
    const cachedProducts = await Cache.getItem(
      `collection:${collectionId}:products:${first}${after ? `:${after}` : ""}`,
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const { data } = await Shopify.client.request(
      `query CollectionProductsQuery($collectionId: ID!, $first: Int!, $after: String) {
      collection(id: $collectionId) {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
        }
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }`,
      {
        variables: { collectionId, first, after },
      },
    );

    if (!data.collection) {
      return null;
    }

    const results = data.collection.products.edges
      .map(({ node }) => {
        const images =
          node.images?.edges?.length > 0
            ? node.images.edges.map(({ node }) => node.url || "")
            : [];

        const soldOut = !node.variants.edges.some(
          ({ node }) => node.availableForSale,
        );

        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          descriptionHtml: node.descriptionHtml,
          images,
          price: node.priceRange.minVariantPrice.amount,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          variants:
            node.variants?.edges?.length > 0
              ? node.variants.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  availableForSale: node.availableForSale,
                  price: node.price.amount,
                }))
              : [],
          soldOut,
        };
      })
      .filter(Boolean);

    const hasMore = data.collection.products.pageInfo?.hasNextPage || false;
    const endCursor = data.collection.products.pageInfo?.endCursor || null;

    const collectionProducts = {
      collection: {
        id: data.collection.id,
        title: data.collection.title,
        handle: data.collection.handle,
        description: data.collection.description,
        descriptionHtml: data.collection.descriptionHtml,
        image: data.collection.image?.url || null,
        imageAlt: data.collection.image?.altText || null,
      },
      products: {
        results,
        hasMore,
        endCursor,
      },
    };

    if (collectionProducts && collectionProducts.products.results.length > 0) {
      Cache.setItem(
        `collection:${collectionId}:products:${first}${
          after ? `:${after}` : ""
        }`,
        collectionProducts,
        120,
      );
    }

    return collectionProducts;
  }

  static async getCollectionProductsByHandle(
    handle,
    first = 100,
    after = null,
  ) {
    const cachedProducts = await Cache.getItem(
      `collection-handle:${handle}:products:${first}${after ? `:${after}` : ""}`,
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const { data } = await Shopify.client.request(
      `query CollectionProductsByHandleQuery($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
        }
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }`,
      {
        variables: { handle, first, after },
      },
    );

    if (!data.collection) {
      return null;
    }

    const results = data.collection.products.edges
      .map(({ node }) => {
        const images =
          node.images?.edges?.length > 0
            ? node.images.edges.map(({ node }) => node.url || "")
            : [];

        const soldOut = !node.variants.edges.some(
          ({ node }) => node.availableForSale,
        );

        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          descriptionHtml: node.descriptionHtml,
          images,
          price: node.priceRange.minVariantPrice.amount,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          variants:
            node.variants?.edges?.length > 0
              ? node.variants.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  availableForSale: node.availableForSale,
                  price: node.price.amount,
                }))
              : [],
          soldOut,
        };
      })
      .filter(Boolean);

    const hasMore = data.collection.products.pageInfo?.hasNextPage || false;
    const endCursor = data.collection.products.pageInfo?.endCursor || null;

    const collectionProducts = {
      collection: {
        id: data.collection.id,
        title: data.collection.title,
        handle: data.collection.handle,
        description: data.collection.description,
        descriptionHtml: data.collection.descriptionHtml,
        image: data.collection.image?.url || null,
        imageAlt: data.collection.image?.altText || null,
      },
      products: {
        results,
        hasMore,
        endCursor,
      },
    };

    if (collectionProducts && collectionProducts.products.results.length > 0) {
      Cache.setItem(
        `collection-handle:${handle}:products:${first}${
          after ? `:${after}` : ""
        }`,
        collectionProducts,
        120,
      );
    }

    return collectionProducts;
  }

  static async getPage(pageId) {
    const cachedPage = await Cache.getItem(`page:${pageId}`);

    if (cachedPage) {
      return cachedPage;
    }

    const { data } = await Shopify.client.request(
      `query PageQuery($pageId: ID!) {
      page(id: $pageId) {
          id
          title
          handle
          body
          bodySummary
          seo {
            title
            description
          }
          createdAt
          updatedAt
        }
      }`,
      {
        variables: { pageId },
      },
    );

    if (!data.page) {
      return null;
    }

    const page = {
      id: data.page.id,
      title: data.page.title,
      handle: data.page.handle,
      body: data.page.body,
      bodySummary: data.page.bodySummary,
      seo: data.page.seo
        ? {
            title: data.page.seo.title || null,
            description: data.page.seo.description || null,
          }
        : null,
      createdAt: data.page.createdAt,
      updatedAt: data.page.updatedAt,
    };

    if (page) {
      Cache.setItem(`page:${pageId}`, page, 120);
    }

    return page;
  }

  static async getPages(first = 100, after = null) {
    const cachedPages = await Cache.getItem(
      `pages:${first}${after ? `:${after}` : ""}`,
    );

    if (cachedPages) {
      return cachedPages;
    }

    const { data } = await Shopify.client.request(
      `query PagesQuery($first: Int!, $after: String) {
      pages(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              body
              bodySummary
              seo {
                title
                description
              }
              createdAt
              updatedAt
            }
          }
        }
      }`,
      {
        variables: { first, after },
      },
    );

    if (!data.pages) {
      return { results: [], hasMore: false };
    }

    const results = data.pages.edges
      .map(({ node }) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        body: node.body,
        bodySummary: node.bodySummary,
        seo: node.seo
          ? {
              title: node.seo.title || null,
              description: node.seo.description || null,
            }
          : null,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      }))
      .filter(Boolean);

    const hasMore = data.pages.pageInfo?.hasNextPage || false;
    const endCursor = data.pages.pageInfo?.endCursor || null;

    const pages = {
      results,
      hasMore,
      endCursor,
    };

    if (pages && pages.results && pages.results.length > 0) {
      Cache.setItem(`pages:${first}${after ? `:${after}` : ""}`, pages, 120);
    }

    return pages;
  }

  static async getPolicies() {
    const { data } = await Shopify.client.request(
      `{
        shop {
          privacyPolicy {
            handle
            title
            body
          }
          refundPolicy {
            handle
            title
            body
          }
          shippingPolicy {
            handle
            title
            body
          }
          termsOfService {
            handle
            title
            body
          }
        }
      }`,
    );

    return data.shop;
  }
}
