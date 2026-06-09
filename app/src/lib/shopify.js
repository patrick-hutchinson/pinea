const SHOPIFY_API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-01";

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $language: LanguageCode) @inContext(language: $language) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        description
        descriptionHtml
        metafield(namespace: "custom", key: "product_type") {
          value
        }
        releaseStatus: metafield(namespace: "custom", key: "release_status") {
          value
        }
        preorderNote: metafield(namespace: "custom", key: "preorder_note") {
          value
        }
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
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
        sellingPlanGroups(first: 10) {
          nodes {
            name
            sellingPlans(first: 10) {
              nodes {
                id
                name
              }
            }
          }
        }
        media(first: 20) {
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
  query GetProductByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      metafield(namespace: "custom", key: "product_type") {
        value
      }
      releaseStatus: metafield(namespace: "custom", key: "release_status") {
        value
      }
      preorderNote: metafield(namespace: "custom", key: "preorder_note") {
        value
      }
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
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
      sellingPlanGroups(first: 10) {
        nodes {
          name
          sellingPlans(first: 10) {
            nodes {
              id
              name
            }
          }
        }
      }
      media(first: 20) {
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
          sellingPlanAllocation {
            sellingPlan {
              id
              name
            }
          }
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
                metafield(namespace: "custom", key: "product_type") {
                  value
                }
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
            sellingPlanAllocation {
              sellingPlan {
                id
                name
              }
            }
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
                  metafield(namespace: "custom", key: "product_type") {
                    value
                  }
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
            sellingPlanAllocation {
              sellingPlan {
                id
                name
              }
            }
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
                  metafield(namespace: "custom", key: "product_type") {
                    value
                  }
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
            sellingPlanAllocation {
              sellingPlan {
                id
                name
              }
            }
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
                  metafield(namespace: "custom", key: "product_type") {
                    value
                  }
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
            sellingPlanAllocation {
              sellingPlan {
                id
                name
              }
            }
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
                  metafield(namespace: "custom", key: "product_type") {
                    value
                  }
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
      sellingPlanId: line?.sellingPlanAllocation?.sellingPlan?.id || null,
      variantTitle: line.merchandise?.title,
      sellingPlanName: line?.sellingPlanAllocation?.sellingPlan?.name || null,
      price: line.merchandise?.price || { amount: "0.00", currencyCode: "USD" },
      product: (() => {
        const productNode = line.merchandise?.product || null;
        const media = mapProductMedia(productNode || {});
        const productType = productNode?.metafield?.value || null;
        const isSubscription = Boolean(line?.sellingPlanAllocation?.sellingPlan?.id) || productType === "membership";

        return {
          id: productNode?.id,
          title: productNode?.title,
          productType,
          isSubscription,
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
  const sourceWidth = preferredSource.width || previewImage?.width || 16;
  const sourceHeight = preferredSource.height || previewImage?.height || 9;

  return {
    type: "video",
    url: preferredSource.url,
    width: sourceWidth,
    height: sourceHeight,
    aspect_ratio: `${sourceWidth}:${sourceHeight}`,
    placeholderUrl: previewImage?.url || null,
  };
};

const mapProductMedia = (node) => {
  const mediaNodes = Array.isArray(node?.media?.nodes) ? node.media.nodes : [];

  const mapped = mediaNodes
    .map((mediaNode) => {
      if (mediaNode?.mediaContentType === "IMAGE" || mediaNode?.mediaContentType === "MEDIA_IMAGE") {
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

const toGalleryItem = (medium, index) => {
  if (!medium) return null;

  return {
    _key: medium.url || medium.playbackId || `shopify-media-${index}`,
    medium,
  };
};

const splitNativeProductMedia = (media = []) => {
  const nativeMedia = Array.isArray(media) ? media.filter(Boolean) : [];
  if (nativeMedia.length === 0) {
    return {
      primaryMedium: null,
      gallery: [],
    };
  }

  const firstImageIndex = nativeMedia.findIndex((medium) => medium?.type === "image");
  const primaryIndex = firstImageIndex >= 0 ? firstImageIndex : 0;
  const primaryMedium = nativeMedia[primaryIndex] || null;
  const gallery = nativeMedia
    .slice(primaryIndex + 1)
    .map((medium, index) => toGalleryItem(medium, index))
    .filter(Boolean);

  return {
    primaryMedium,
    gallery,
  };
};

const mapProduct = (node) => {
  const media = mapProductMedia(node);
  const nativeMediaSplit = splitNativeProductMedia(media);
  const gallery = nativeMediaSplit.gallery;
  const rawCategory = node?.metafield?.value;
  const category = typeof rawCategory === "string" ? rawCategory.trim().toLowerCase() : "";
  const rawReleaseStatus = node?.releaseStatus?.value;
  const releaseStatus = typeof rawReleaseStatus === "string" ? rawReleaseStatus.trim().toLowerCase() : "";
  const preorderNote = typeof node?.preorderNote?.value === "string" ? node.preorderNote.value.trim() : "";
  const variants = Array.isArray(node?.variants?.nodes)
    ? node.variants.nodes.map((variant) => ({
        id: variant?.id,
        title: variant?.title || "",
        availableForSale: Boolean(variant?.availableForSale),
        price: variant?.price || { amount: "0.00", currencyCode: "USD" },
        selectedOptions: Array.isArray(variant?.selectedOptions) ? variant.selectedOptions : [],
      }))
    : [];

  const sellingPlans = Array.isArray(node?.sellingPlanGroups?.nodes)
    ? node.sellingPlanGroups.nodes.flatMap((group) =>
        (group?.sellingPlans?.nodes || []).map((plan) => ({
          id: plan?.id,
          name: plan?.name || group?.name || "Subscription",
          groupName: group?.name || "",
        })),
      )
    : [];

  const firstVariant = variants.find((variant) => variant.availableForSale) || variants[0] || null;
  const firstSellingPlan = sellingPlans[0] || null;

  return {
    media,
    gallery,
    primaryMedium: nativeMediaSplit.primaryMedium || null,
    category: category || null,
    releaseStatus: releaseStatus || null,
    preorderNote: preorderNote || null,
    variants,
    sellingPlans,
    isSubscription: sellingPlans.length > 0,
    defaultSellingPlanId: firstSellingPlan?.id || null,
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || "",
    descriptionHtml: node.descriptionHtml || "",
    image: node.featuredImage || null,
    price: firstVariant?.price || node.priceRange?.minVariantPrice || { amount: "0.00", currencyCode: "USD" },
    firstVariantId: firstVariant?.id || null,
    availableForSale: variants.some((variant) => variant.availableForSale),
  };
};

const toI18nField = (deValue, enValue) => {
  const de = typeof deValue === "string" ? deValue : "";
  const en = typeof enValue === "string" && enValue.length > 0 ? enValue : de;

  return [
    { _key: "de", value: de },
    { _key: "en", value: en },
  ];
};

const mergeLocalizedProduct = (deProduct, enProduct) => {
  if (!deProduct) return null;

  return {
    ...deProduct,
    titleTranslations: toI18nField(deProduct.title, enProduct?.title),
    descriptionTranslations: toI18nField(deProduct.description, enProduct?.description),
    descriptionHtmlTranslations: toI18nField(deProduct.descriptionHtml || "", enProduct?.descriptionHtml || ""),
    preorderNoteTranslations: toI18nField(deProduct.preorderNote || "", enProduct?.preorderNote || ""),
  };
};

export async function getShopifyProducts(first = 12) {
  const [deData, enData] = await Promise.all([
    storefrontRequest(PRODUCTS_QUERY, { first, language: "DE" }, { next: { revalidate: 60 } }),
    storefrontRequest(PRODUCTS_QUERY, { first, language: "EN" }, { next: { revalidate: 60 } }),
  ]);

  const deNodes = Array.isArray(deData?.products?.nodes) ? deData.products.nodes : [];
  const enNodes = Array.isArray(enData?.products?.nodes) ? enData.products.nodes : [];
  const enById = new Map(enNodes.map((node) => [node.id, node]));

  return deNodes
    .map((deNode) => {
      const enNode = enById.get(deNode.id) || null;
      const deProduct = mapProduct(deNode);
      const enProduct = enNode ? mapProduct(enNode) : null;
      return mergeLocalizedProduct(deProduct, enProduct);
    })
    .filter(Boolean);
}

export async function getShopifyProductByHandle(handle) {
  if (!handle) return null;
  const [deData, enData] = await Promise.all([
    storefrontRequest(PRODUCT_BY_HANDLE_QUERY, { handle, language: "DE" }, { next: { revalidate: 60 } }),
    storefrontRequest(PRODUCT_BY_HANDLE_QUERY, { handle, language: "EN" }, { next: { revalidate: 60 } }),
  ]);

  if (!deData?.product) return null;

  const deProduct = mapProduct(deData.product);
  const enProduct = enData?.product ? mapProduct(enData.product) : null;
  return mergeLocalizedProduct(deProduct, enProduct);
}

export async function getCart(cartId) {
  if (!cartId) return null;
  const data = await storefrontRequest(CART_QUERY, { cartId }, { cache: "no-store" });
  return mapCart(data?.cart);
}

export async function addToCart({ cartId, merchandiseId, quantity = 1, sellingPlanId = null, requiresSellingPlan = false }) {
  if (!merchandiseId) throw new Error("Missing merchandiseId.");
  if (requiresSellingPlan && !sellingPlanId) {
    throw new Error("Missing sellingPlanId for subscription line.");
  }

  const lines = [
    {
      merchandiseId,
      quantity: Math.max(1, Number(quantity) || 1),
      ...(sellingPlanId ? { sellingPlanId } : {}),
    },
  ];

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
