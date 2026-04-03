"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import styles from "./ShopPage.module.css";
import ShopIcon from "@/components/PineaIcon/ShopIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import AnimationLink from "@/components/Animation/AnimationLink";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import Button from "@/components/Buttons/Button";
import BasketDrawer from "./components/BasketDrawer";
import { translate } from "@/helpers/translate";

const formatPrice = (amount, currencyCode) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(value);
};

const CART_STORAGE_KEY = "pinea_shopify_cart_id";
const BASKET_STATE_STORAGE_KEY = "pinea_shopify_basket_state";
const CATEGORY_LABELS = {
  edition: "Editions",
  periodical: "Periodicals",
  membership: "Memberships",
};

const PURCHASE_STATE_LABELS = {
  comingSoon: [
    { _key: "de", value: "Demnächst" },
    { _key: "en", value: "Coming soon" },
  ],
  preOrder: [
    { _key: "de", value: "Vorbestellung" },
    { _key: "en", value: "Pre-order" },
  ],
  soldOut: [
    { _key: "de", value: "Ausverkauft" },
    { _key: "en", value: "Sold out" },
  ],
};

const toCategoryLabel = (value) => {
  if (!value) return null;
  if (CATEGORY_LABELS[value]) return CATEGORY_LABELS[value];

  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const getPurchaseState = (product, labels) => {
  const status = product?.releaseStatus;

  if (status === "coming_soon") {
    return { canAdd: false, label: labels.comingSoon };
  }

  if (status === "preorder") {
    return { canAdd: Boolean(product?.availableForSale), label: labels.preOrder };
  }

  if (!product?.availableForSale) {
    return { canAdd: false, label: labels.soldOut };
  }

  return { canAdd: true, label: null };
};

const getCardPriceLabel = (product) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const pricedVariants = variants
    .filter((variant) => variant?.price?.amount != null)
    .map((variant) => ({
      amount: Number(variant.price.amount),
      currencyCode: variant.price.currencyCode || product?.price?.currencyCode || "USD",
      availableForSale: Boolean(variant.availableForSale),
    }))
    .filter((variant) => Number.isFinite(variant.amount));

  const availablePricedVariants = pricedVariants.filter((variant) => variant.availableForSale);
  const candidateVariants = availablePricedVariants.length > 0 ? availablePricedVariants : pricedVariants;
  const cheapest = candidateVariants.reduce((lowest, current) => (current.amount < lowest.amount ? current : lowest), candidateVariants[0]);

  if (product?.isSubscription && variants.length > 1 && cheapest) {
    return `from ${formatPrice(cheapest.amount, cheapest.currencyCode)}`;
  }

  return formatPrice(product?.price?.amount, product?.price?.currencyCode);
};

const ShopCardPrimaryMedium = ({ medium }) => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.mediaWrap_inner} ref={containerRef}>
      <ExpandMedia
        className={styles.cardExpandMedia}
        medium={medium}
        containerDimensions={containerDimensions}
        cropMultiplier={1}
      />
    </div>
  );
};

const ShopCardFallback = ({ title }) => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight;
  const aspectRatio = 3 / 4;
  const factor = 1;

  const maxMediaWidth = containerDimensions?.width * factor;
  const maxMediaHeight = containerDimensions?.height * factor;

  const naturalWidth = aspectRatio > 1 ? 1 : aspectRatio;
  const naturalHeight = aspectRatio > 1 ? 1 / aspectRatio : 1;
  const scale = maxMediaWidth && maxMediaHeight ? Math.min(maxMediaWidth / naturalWidth, maxMediaHeight / naturalHeight) : 0;

  const mediaWidth = naturalWidth * scale;
  const mediaHeight = naturalHeight * scale;

  return (
    <div className={styles.mediaWrap_inner} ref={containerRef}>
      <motion.div
        className={`${styles.imagePlaceholderMotion} ${styles.cardExpandMedia}`}
        initial={{ scale: initialScale }}
        animate={{ scale: initialScale }}
        whileHover={{
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          },
        }}
        style={{
          width: mediaWidth || undefined,
          height: mediaHeight || undefined,
        }}
      >
        <div className={styles.imagePlaceholder}>
          <h2 className={styles.imagePlaceholderTitle} typo="h3">
            {title}
          </h2>
        </div>
      </motion.div>
    </div>
  );
};

const ShopPage = ({ products = [], error }) => {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);
  const purchaseLabels = {
    comingSoon: translate(PURCHASE_STATE_LABELS.comingSoon) || "Coming soon",
    preOrder: translate(PURCHASE_STATE_LABELS.preOrder) || "Pre-order",
    soldOut: translate(PURCHASE_STATE_LABELS.soldOut) || "Sold out",
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("shopify-basket-updated", {
        detail: { totalQuantity: cart?.totalQuantity || 0 },
      }),
    );
  }, [cart?.totalQuantity]);

  useEffect(() => {
    const openBasket = () => setIsCartOpen(true);
    const toggleBasket = () => setIsCartOpen((prev) => !prev);
    window.addEventListener("shopify-basket-open", openBasket);
    window.addEventListener("shopify-basket-toggle", toggleBasket);

    return () => {
      window.removeEventListener("shopify-basket-open", openBasket);
      window.removeEventListener("shopify-basket-toggle", toggleBasket);
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("basket") !== "open") return;
    setIsCartOpen(true);
    window.history.replaceState(window.history.state, "", "/shop");
  }, [searchParams]);

  useEffect(() => {
    const storedBasket = window.localStorage.getItem(BASKET_STATE_STORAGE_KEY);
    if (storedBasket) {
      try {
        setCart(JSON.parse(storedBasket));
      } catch {
        window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      }
    }

    const cartId = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!cartId) return;

    const loadCart = async () => {
      const response = await fetch(`/api/shopify/cart?cartId=${encodeURIComponent(cartId)}`, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not load cart.");
      }

      if (!payload?.cart) {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      }

      setCart(payload?.cart || null);
    };

    loadCart().catch((loadError) => {
      setCartError(loadError.message);
    });
  }, []);

  useEffect(() => {
    if (!cart?.id) {
      window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, cart.id);
    window.localStorage.setItem(BASKET_STATE_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const changeLineQuantity = async (lineId, quantity) => {
    if (!cart?.id || !lineId) return;
    setCartError(null);
    setPendingLineId(lineId);

    try {
      const response = await fetch("/api/shopify/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          lineId,
          quantity,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Could not update cart.");
      }

      setCart(payload.cart);
      if (!payload?.cart || payload.cart.totalQuantity === 0) {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      }
    } catch (updateError) {
      setCartError(updateError.message);
    } finally {
      setPendingLineId(null);
    }
  };

  const quickAddToCart = async (product) => {
    const purchaseState = getPurchaseState(product, purchaseLabels);
    if (!product?.firstVariantId || !purchaseState.canAdd || addingProductId) return;

    setCartError(null);
    setAddingProductId(product.id);

    try {
      const cartId = window.localStorage.getItem(CART_STORAGE_KEY);
      const response = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId || null,
          merchandiseId: product.firstVariantId,
          quantity: 1,
          sellingPlanId: product.defaultSellingPlanId || null,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Could not add product.");
      }

      if (payload?.cart?.id) {
        window.localStorage.setItem(CART_STORAGE_KEY, payload.cart.id);
      }

      setCart(payload?.cart || null);
      setIsCartOpen(true);
      window.dispatchEvent(
        new CustomEvent("shopify-basket-updated", {
          detail: { totalQuantity: payload?.cart?.totalQuantity || 0 },
        }),
      );
    } catch (error) {
      setCartError(error instanceof Error ? error.message : "Could not add product.");
    } finally {
      setAddingProductId(null);
    }
  };

  const categoryValues = Array.from(
    new Set(products.map((product) => product?.category).filter((value) => typeof value === "string" && value.length > 0)),
  );

  const categoryOptions = categoryValues.map((value) => ({ value, label: toCategoryLabel(value) || value }));

  const visibleProducts =
    activeCategories.length === 0 ? products : products.filter((product) => activeCategories.includes(product.category));

  const handleFilter = (label) => {
    const selected = categoryOptions.find((option) => option.label === label);
    if (!selected) return;

    setActiveCategories((prev) => {
      if (prev.includes(selected.value)) {
        return prev.filter((value) => value !== selected.value);
      }

      return [...prev, selected.value];
    });
  };

  const activeCategoryLabels = activeCategories
    .map((value) => categoryOptions.find((option) => option.value === value)?.label)
    .filter(Boolean);

  return (
    <main className={styles.main}>
      <FilterHeader
        array={categoryOptions.map((option) => option.label)}
        handleFilter={handleFilter}
        currentlyActive={activeCategoryLabels}
      />
      <BlurContainer>
        {error ? <p className={styles.error}>Shopify error: {error}</p> : null}
        {cartError ? <p className={styles.error}>Basket error: {cartError}</p> : null}

        <BasketDrawer
          basket={cart}
          isOpen={isCartOpen}
          onOpen={() => setIsCartOpen(true)}
          onClose={() => setIsCartOpen(false)}
          pendingLineId={pendingLineId}
          onChangeLineQuantity={changeLineQuantity}
        />

        {!error && visibleProducts.length === 0 ? <p className={styles.empty}>No products found.</p> : null}

        <LayoutGroup>
          <section className={styles.grid}>
            <AnimatePresence initial={false} mode="popLayout">
              {visibleProducts.map((product) => {
                const purchaseState = getPurchaseState(product, purchaseLabels);
                const isPreOrder = product?.releaseStatus === "preorder";
                const isSoldOut = purchaseState.label === purchaseLabels.soldOut;
                const productTitle = translate(product.titleTranslations) || product.title;
                const cardPriceLabel = getCardPriceLabel(product);

                return (
                  <motion.article
                    className={`${styles.card} ${isSoldOut ? styles.cardSoldOut : ""}`}
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.2, ease: "easeInOut" },
                      layout: { duration: 0.3, ease: "easeInOut" },
                    }}
                  >
                    <>
                      <AnimationLink path={`/shop/${product.handle}`} className={styles.cardLink}>
                        <div className={styles.mediaWrap}>
                          {product.primaryMedium ? (
                            <ShopCardPrimaryMedium medium={product.primaryMedium} />
                          ) : (
                            <ShopCardFallback title={productTitle} />
                          )}
                        </div>
                      </AnimationLink>

                      <div className={styles.cardBody}>
                        <AnimationLink path={`/shop/${product.handle}`} className={styles.titleLink}>
                          <div typo="h4" className={styles.productTitle}>
                            {productTitle}, {cardPriceLabel}
                          </div>
                        </AnimationLink>
                        <div className={styles.cardActions}>
                          {isPreOrder || isSoldOut ? (
                            <Button className={styles.statusButton} style={{ pointerEvents: "none" }}>
                              {purchaseState.label}
                            </Button>
                          ) : purchaseState.label ? (
                            <div className={styles.statusLabel}>{purchaseState.label}</div>
                          ) : null}
                          {!isSoldOut ? (
                            <Button
                              className={styles.quickAddButton}
                              onClick={() => quickAddToCart(product)}
                              style={{
                                pointerEvents: purchaseState.canAdd ? "auto" : "none",
                              }}
                            >
                              <img
                                src="/icons/add-button.svg"
                                alt="Add to basket"
                                width={14}
                                height={14}
                                className={styles.quickAddIcon}
                              />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </section>
        </LayoutGroup>
      </BlurContainer>

      <ShopIcon />
    </main>
  );
};

export default ShopPage;
