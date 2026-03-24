const SHOPIFY_API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-01";

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        description
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
        media(first: 6) {
          nodes {
            mediaContentType
            previewImage {
              url(transform: { maxWidth: 40 })
              altText
              width
              height
            }
            ... on MediaImage {
              image {
                url(transform: { maxWidth: 2200 })
                altText
                width
                height
              }
            }
            ... on Video {
              sources {
                url
                mimeType
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      featuredImage {
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
                media(first: 1) {
                  nodes {
                    mediaContentType
                    previewImage {
                      url(transform: { maxWidth: 40 })
                      altText
                      width
                      height
                    }
                    ... on MediaImage {
                      image {
                        url(transform: { maxWidth: 2200 })
                        altText
                        width
                        height
                      }
                    }
                    ... on Video {
                      sources {
                        url
                        mimeType
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  featuredImage {
                    url
                    altText
                    width
                    height
                  }
                  media(first: 1) {
                    nodes {
                      mediaContentType
                      previewImage {
                        url(transform: { maxWidth: 40 })
                        altText
                        width
                        height
                      }
                      ... on MediaImage {
                        image {
                          url(transform: { maxWidth: 2200 })
                          altText
                          width
                          height
                        }
                      }
                      ... on Video {
                        sources {
                          url
                          mimeType
                          width
                          height
                        }
                      }
                    }
                  }
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
  }
`;

const ADD_LINES_MUTATION = `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  featuredImage {
                    url
                    altText
                    width
                    height
                  }
                  media(first: 1) {
                    nodes {
                      mediaContentType
                      previewImage {
                        url(transform: { maxWidth: 40 })
                        altText
                        width
                        height
                      }
                      ... on MediaImage {
                        image {
                          url(transform: { maxWidth: 2200 })
                          altText
                          width
                          height
                        }
                      }
                      ... on Video {
                        sources {
                          url
                          mimeType
                          width
                          height
                        }
                      }
                    }
                  }
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
  }
`;

const UPDATE_LINES_MUTATION = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  featuredImage {
                    url
                    altText
                    width
                    height
                  }
                  media(first: 1) {
                    nodes {
                      mediaContentType
                      previewImage {
                        url(transform: { maxWidth: 40 })
                        altText
                        width
                        height
                      }
                      ... on MediaImage {
                        image {
                          url(transform: { maxWidth: 2200 })
                          altText
                          width
                          height
                        }
                      }
                      ... on Video {
                        sources {
                          url
                          mimeType
                          width
                          height
                        }
                      }
                    }
                  }
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
  }
`;

const REMOVE_LINES_MUTATION = `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  featuredImage {
                    url
                    altText
                    width
                    height
                  }
                  media(first: 1) {
                    nodes {
                      mediaContentType
                      previewImage {
                        url(transform: { maxWidth: 40 })
                        altText
                        width
                        height
                      }
                      ... on MediaImage {
                        image {
                          url(transform: { maxWidth: 2200 })
                          altText
                          width
                          height
                        }
                      }
                      ... on Video {
                        sources {
                          url
                          mimeType
                          width
                          height
                        }
                      }
                    }
                  }
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
  }
`;

const getShopifyConfig = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN environment variable.");
  }

  if (!token) {
    throw new Error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable.");
  }

  return { domain, token };
};

async function storefrontRequest(query, variables = {}, options = {}) {
  const { domain, token } = getShopifyConfig();
  const endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Storefront request failed (${response.status}): ${text.slice(0, 250)}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    throw new Error(payload.errors.map((entry) => entry.message).join("; "));
  }

  return payload.data;
}

const mapCart = (cart) => {
  if (!cart) return null;

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity || 0,
    subtotal: cart.cost?.subtotalAmount || { amount: "0.00", currencyCode: "USD" },
    total: cart.cost?.totalAmount || { amount: "0.00", currencyCode: "USD" },
    lines: (cart.lines?.nodes || []).map((line) => ({
      id: line.id,
      quantity: line.quantity,
      merchandiseId: line.merchandise?.id,
      variantTitle: line.merchandise?.title,
      price: line.merchandise?.price || { amount: "0.00", currencyCode: "USD" },
      product: (() => {
        const productNode = line.merchandise?.product || null;
        const media = mapProductMedia(productNode || {});

        return {
          id: productNode?.id,
          title: productNode?.title,
          image: productNode?.featuredImage || null,
          primaryMedium: media[0] || null,
        };
      })(),
    })),
  };
};

const throwUserErrors = (errors = []) => {
  if (!Array.isArray(errors) || errors.length === 0) return;
  throw new Error(errors.map((entry) => entry.message).join("; "));
};

const mapMediaImage = (image, previewImage) => {
  if (!image?.url) return null;

  return {
    type: "image",
    url: image.url,
    width: image.width || previewImage?.width || 1200,
    height: image.height || previewImage?.height || 1500,
    altText: image.altText || previewImage?.altText || "",
    placeholderUrl: previewImage?.url || `${image.url}?w=40&fit=crop&auto=format`,
  };
};

const mapMediaVideo = (sources = [], previewImage) => {
  const preferredSource = sources.find((source) => source?.mimeType?.includes("mp4")) || sources[0];
  if (!preferredSource?.url) return null;

  return {
    type: "video",
    url: preferredSource.url,
    width: preferredSource.width || previewImage?.width || 16,
    height: preferredSource.height || previewImage?.height || 9,
    placeholderUrl: previewImage?.url || null,
  };
};

const mapProductMedia = (node) => {
  const mediaNodes = Array.isArray(node?.media?.nodes) ? node.media.nodes : [];

  const mapped = mediaNodes
    .map((mediaNode) => {
      if (mediaNode?.mediaContentType === "MEDIA_IMAGE") {
        return mapMediaImage(mediaNode.image, mediaNode.previewImage);
      }

      if (mediaNode?.mediaContentType === "VIDEO") {
        return mapMediaVideo(mediaNode.sources, mediaNode.previewImage);
      }

      return null;
    })
    .filter(Boolean);

  if (mapped.length > 0) return mapped;

  const featuredFallback = mapMediaImage(node?.featuredImage, null);
  return featuredFallback ? [featuredFallback] : [];
};

const mapProduct = (node) => {
  const media = mapProductMedia(node);

  return {
    media,
    primaryMedium: media[0] || null,
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || "",
    image: node.featuredImage || null,
    price: node.variants?.nodes?.[0]?.price || node.priceRange?.minVariantPrice || { amount: "0.00", currencyCode: "USD" },
    firstVariantId: node.variants?.nodes?.[0]?.id || null,
    availableForSale: Boolean(node.variants?.nodes?.[0]?.availableForSale),
  };
};

export async function getShopifyProducts(first = 12) {
  const data = await storefrontRequest(PRODUCTS_QUERY, { first }, { next: { revalidate: 60 } });

  const nodes = data?.products?.nodes;
  if (!Array.isArray(nodes)) return [];

  return nodes.map(mapProduct);
}

export async function getShopifyProductByHandle(handle) {
  if (!handle) return null;
  const data = await storefrontRequest(PRODUCT_BY_HANDLE_QUERY, { handle }, { next: { revalidate: 60 } });
  if (!data?.product) return null;
  return mapProduct(data.product);
}

export async function getCart(cartId) {
  if (!cartId) return null;
  const data = await storefrontRequest(CART_QUERY, { cartId }, { cache: "no-store" });
  return mapCart(data?.cart);
}

export async function addToCart({ cartId, merchandiseId, quantity = 1 }) {
  if (!merchandiseId) throw new Error("Missing merchandiseId.");

  const lines = [{ merchandiseId, quantity: Math.max(1, Number(quantity) || 1) }];

  if (!cartId) {
    const data = await storefrontRequest(CREATE_CART_MUTATION, { lines }, { cache: "no-store" });
    const result = data?.cartCreate;
    throwUserErrors(result?.userErrors);
    return mapCart(result?.cart);
  }

  const data = await storefrontRequest(ADD_LINES_MUTATION, { cartId, lines }, { cache: "no-store" });
  const result = data?.cartLinesAdd;
  throwUserErrors(result?.userErrors);
  return mapCart(result?.cart);
}

export async function updateCartLine({ cartId, lineId, quantity }) {
  if (!cartId) throw new Error("Missing cartId.");
  if (!lineId) throw new Error("Missing lineId.");

  const safeQuantity = Number(quantity);

  if (safeQuantity <= 0) {
    const data = await storefrontRequest(REMOVE_LINES_MUTATION, { cartId, lineIds: [lineId] }, { cache: "no-store" });
    const result = data?.cartLinesRemove;
    throwUserErrors(result?.userErrors);
    return mapCart(result?.cart);
  }

  const lines = [{ id: lineId, quantity: safeQuantity }];
  const data = await storefrontRequest(UPDATE_LINES_MUTATION, { cartId, lines }, { cache: "no-store" });
  const result = data?.cartLinesUpdate;
  throwUserErrors(result?.userErrors);
  return mapCart(result?.cart);
}
