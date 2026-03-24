"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";
import { translate } from "@/helpers/translate";

import styles from "./ProductPage.module.css";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Satellite from "@/components/Satellite/Satellite";
import BasketDrawer from "../components/BasketDrawer";

const formatPrice = (amount, currencyCode) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(value);
};

const BASKET_STORAGE_KEY = "pinea_shopify_cart_id";
const BASKET_STATE_STORAGE_KEY = "pinea_shopify_basket_state";

const getPurchaseState = (product, variant) => {
  const status = product?.releaseStatus;
  const variantAvailable = variant ? Boolean(variant.availableForSale) : Boolean(product?.availableForSale);

  if (status === "coming_soon") {
    return { canAdd: false, label: "Coming soon" };
  }

  if (status === "preorder") {
    return { canAdd: variantAvailable, label: "Pre-order" };
  }

  if (!variantAvailable) {
    return { canAdd: false, label: "Sold out" };
  }

  return { canAdd: true, label: "Add to Shopping Basket" };
};

const ProductPage = ({ product, site, relatedProducts = [] }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isAtPageBottom, setIsAtPageBottom] = useState(false);
  const [basket, setBasket] = useState(null);
  const [basketError, setBasketError] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const productGalleryRef = useRef(null);
  const [selectedVariantId, setSelectedVariantId] = useState(product?.firstVariantId || null);
  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState(product?.defaultSellingPlanId || null);

  useEffect(() => {
    const updateBottomState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const threshold = 8;
      setIsAtPageBottom(scrollTop + viewportHeight >= fullHeight - threshold);
    };

    updateBottomState();
    window.addEventListener("scroll", updateBottomState, { passive: true });
    window.addEventListener("resize", updateBottomState);

    return () => {
      window.removeEventListener("scroll", updateBottomState);
      window.removeEventListener("resize", updateBottomState);
    };
  }, []);

  useEffect(() => {
    const openBasket = () => setIsBasketOpen(true);
    const toggleBasket = () => setIsBasketOpen((prev) => !prev);
    window.addEventListener("shopify-basket-open", openBasket);
    window.addEventListener("shopify-basket-toggle", toggleBasket);

    return () => {
      window.removeEventListener("shopify-basket-open", openBasket);
      window.removeEventListener("shopify-basket-toggle", toggleBasket);
    };
  }, []);

  useEffect(() => {
    const storedBasket = window.localStorage.getItem(BASKET_STATE_STORAGE_KEY);
    if (storedBasket) {
      try {
        setBasket(JSON.parse(storedBasket));
      } catch {
        window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      }
    }

    const basketId = window.localStorage.getItem(BASKET_STORAGE_KEY);
    if (!basketId) return;

    const loadBasket = async () => {
      const response = await fetch(`/api/shopify/cart?cartId=${encodeURIComponent(basketId)}`, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not load basket.");
      }

      if (!payload?.cart) {
        window.localStorage.removeItem(BASKET_STORAGE_KEY);
        window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      }

      setBasket(payload?.cart || null);
    };

    loadBasket().catch((loadError) => {
      setBasketError(loadError.message);
    });
  }, []);

  useEffect(() => {
    if (!basket?.id) {
      window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(BASKET_STORAGE_KEY, basket.id);
    window.localStorage.setItem(BASKET_STATE_STORAGE_KEY, JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    setSelectedVariantId(product?.firstVariantId || null);
    setSelectedSellingPlanId(product?.defaultSellingPlanId || null);
  }, [product?.id, product?.firstVariantId, product?.defaultSellingPlanId]);

  const addToCart = async () => {
    if (!selectedVariantId || isAdding) return;

    setFeedback(null);
    setIsAdding(true);

    try {
      const basketId = window.localStorage.getItem(BASKET_STORAGE_KEY);
      const response = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: basketId || null,
          merchandiseId: selectedVariantId,
          quantity: 1,
          sellingPlanId: product?.isSubscription ? selectedSellingPlanId || product?.defaultSellingPlanId : null,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Could not add product.");
      }

      if (payload?.cart?.id) {
        window.localStorage.setItem(BASKET_STORAGE_KEY, payload.cart.id);
      }
      setBasket(payload?.cart || null);
      setIsBasketOpen(true);

      window.dispatchEvent(
        new CustomEvent("shopify-basket-updated", {
          detail: { totalQuantity: payload?.cart?.totalQuantity || 0 },
        }),
      );

      setFeedback("Added to basket.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not add product.");
    } finally {
      setIsAdding(false);
    }
  };

  const changeLineQuantity = async (lineId, quantity) => {
    if (!basket?.id || !lineId) return;
    setBasketError(null);
    setPendingLineId(lineId);

    try {
      const response = await fetch("/api/shopify/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: basket.id,
          lineId,
          quantity,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Could not update basket.");
      }

      setBasket(payload.cart);
      if (!payload?.cart || payload.cart.totalQuantity === 0) {
        window.localStorage.removeItem(BASKET_STORAGE_KEY);
        window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      }

      window.dispatchEvent(
        new CustomEvent("shopify-basket-updated", {
          detail: { totalQuantity: payload?.cart?.totalQuantity || 0 },
        }),
      );
    } catch (updateError) {
      setBasketError(updateError.message);
    } finally {
      setPendingLineId(null);
    }
  };

  const scrollToGallery = () => {
    if (!productGalleryRef.current) return;
    productGalleryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || variants[0] || null;
  const purchaseState = getPurchaseState(product, selectedVariant);
  const displayPrice = selectedVariant?.price || product?.price;
  const productTitle = translate(product.titleTranslations) || product.title;
  const productDescription = translate(product.descriptionTranslations) || product.description;
  const preorderNote = translate(product.preorderNoteTranslations) || product.preorderNote;
  const relatedProductLinks = relatedProducts.map((item) => ({
    label: translate(item?.titleTranslations) || item?.title || "",
    href: item?.href,
  }));

  return (
    <main className={styles.main}>
      <FilterHeader array={relatedProductLinks} currentlyActive={productTitle} />
      <div className={styles.container}>
        {basketError ? <p className={styles.error}>Basket error: {basketError}</p> : null}

        <BasketDrawer
          basket={basket}
          isOpen={isBasketOpen}
          onOpen={() => setIsBasketOpen(true)}
          onClose={() => setIsBasketOpen(false)}
          pendingLineId={pendingLineId}
          onChangeLineQuantity={changeLineQuantity}
        />

        <article className={styles.product}>
          <div className={styles.mediaWrap}>
            {product.primaryMedium ? (
              <div className={styles.primaryMediumWrapper}>
                <Media medium={product.primaryMedium} objectFit="contain" />
              </div>
            ) : (
              <div className={styles.imagePlaceholder}>
                <div typo="h3" className={styles.imagePlaceholderTitle}>
                  {productTitle}
                </div>
              </div>
            )}
          </div>

          <div className={styles.content}>
            {productDescription ? <Text text={productDescription} typo="longcopy" className={styles.longcopy} /> : null}
            {displayPrice ? (
              <p className={styles.price}>
                {formatPrice(displayPrice.amount, displayPrice.currencyCode)}
              </p>
            ) : null}
            {variants.length > 1 ? (
              <div className={styles.variantSelector}>
                {variants.map((variant) => {
                  const labelFromOptions =
                    variant.selectedOptions?.map((option) => option?.value).filter(Boolean).join(" / ") || variant.title;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`${styles.selectorButton} ${selectedVariantId === variant.id ? styles.selectorButtonActive : ""}`}
                    >
                      {labelFromOptions}
                    </button>
                  );
                })}
              </div>
            ) : null}
            {product?.isSubscription && Array.isArray(product?.sellingPlans) && product.sellingPlans.length > 1 ? (
              <div className={styles.variantSelector}>
                {product.sellingPlans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedSellingPlanId(plan.id)}
                    className={`${styles.selectorButton} ${selectedSellingPlanId === plan.id ? styles.selectorButtonActive : ""}`}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            ) : null}
            {preorderNote ? <p className={styles.preorderNote}>{preorderNote}</p> : null}
          </div>
        </article>

        <div className={styles.sectionDivider} aria-hidden="true" />

        <div className={styles.productGallery} ref={productGalleryRef}>
          <div className={styles.productTitle}>{productTitle}</div>
          <Satellite media={site.gallery} behaviour="expand" className={styles.satellite} />
        </div>

        <div className={styles.navigationFooter}>
          <div className={styles.navActionSlot}>
            <AnimatePresence mode="wait" initial={false}>
              {isAtPageBottom ? (
                <motion.button
                  key="scroll-top"
                  className={styles.backLink}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  Scroll to top
                </motion.button>
              ) : (
                <motion.button
                  key="see-more"
                  className={styles.navActionLayer}
                  type="button"
                  onClick={scrollToGallery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <span className={styles.backLink}>See More</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <button
            className={styles.addButton}
            type="button"
            onClick={addToCart}
            disabled={!purchaseState.canAdd || isAdding}
          >
            {isAdding ? "Adding..." : purchaseState.label}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
