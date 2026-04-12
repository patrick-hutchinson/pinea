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
import ShopIcon from "@/components/PineaIcon/ShopIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

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

const PURCHASE_STATE_LABELS = {
  comingSoon: [
    { _key: "de", value: "Demnächst" },
    { _key: "en", value: "Coming soon" },
  ],
  preOrder: [
    { _key: "de", value: "Vorbestellung" },
    { _key: "en", value: "Pre-order" },
  ],
  preOrderCheckout: [
    { _key: "de", value: "Vorbestellen" },
    { _key: "en", value: "Pre-order" },
  ],
  soldOut: [
    { _key: "de", value: "Ausverkauft" },
    { _key: "en", value: "Sold out" },
  ],
  addToBasket: [
    { _key: "de", value: "Zum Warenkorb hinzufügen" },
    { _key: "en", value: "Add to Basket" },
  ],
  addingToBasket: [
    { _key: "de", value: "WIRD HINZUGEFÜGT..." },
    { _key: "en", value: "Adding..." },
  ],
  showInfo: [
    { _key: "de", value: "MEHR ANZEIGEN" },
    { _key: "en", value: "Show Info" },
  ],
  scrollToTop: [
    { _key: "de", value: "NACH OBEN" },
    { _key: "en", value: "Scroll to top" },
  ],
};

const getPurchaseState = (product, variant, labels) => {
  const status = product?.releaseStatus;
  const variantAvailable = variant ? Boolean(variant.availableForSale) : Boolean(product?.availableForSale);

  if (status === "coming_soon") {
    return { canAdd: false, label: labels.comingSoon };
  }

  if (status === "preorder") {
    return { canAdd: variantAvailable, label: labels.preOrderCheckout };
  }

  if (!variantAvailable) {
    return { canAdd: false, label: labels.soldOut };
  }

  return { canAdd: true, label: labels.addToBasket };
};

const ProductPage = ({ product, relatedProducts = [] }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isAtPageBottom, setIsAtPageBottom] = useState(false);
  const [basket, setBasket] = useState(null);
  const [basketError, setBasketError] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const productGalleryRef = useRef(null);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.isSubscription ? null : product?.firstVariantId || null,
  );
  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState(product?.defaultSellingPlanId || null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

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
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const applyMatch = () => setIsMobileViewport(mediaQuery.matches);
    applyMatch();
    mediaQuery.addEventListener("change", applyMatch);
    return () => mediaQuery.removeEventListener("change", applyMatch);
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
    setSelectedVariantId(product?.isSubscription ? null : product?.firstVariantId || null);
    setSelectedSellingPlanId(product?.defaultSellingPlanId || null);
  }, [product?.id, product?.isSubscription, product?.firstVariantId, product?.defaultSellingPlanId]);

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
  const lastVariantId = variants.length > 0 ? variants[variants.length - 1]?.id : null;
  const isLastVariantSelected = Boolean(selectedVariantId && lastVariantId && selectedVariantId === lastVariantId);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || null;
  const hasRequiredVariantSelection = !product?.isSubscription || variants.length <= 1 || Boolean(selectedVariantId);
  const purchaseLabels = {
    comingSoon: translate(PURCHASE_STATE_LABELS.comingSoon) || "Coming soon",
    preOrder: translate(PURCHASE_STATE_LABELS.preOrder) || "Pre-order",
    preOrderCheckout: translate(PURCHASE_STATE_LABELS.preOrderCheckout) || "Pre-order",
    soldOut: translate(PURCHASE_STATE_LABELS.soldOut) || "Sold out",
    addToBasket: translate(PURCHASE_STATE_LABELS.addToBasket) || "Add to Shopping Basket",
    addingToBasket: translate(PURCHASE_STATE_LABELS.addingToBasket) || "Adding...",
    showInfo: translate(PURCHASE_STATE_LABELS.showInfo) || "Show Info",
    scrollToTop: translate(PURCHASE_STATE_LABELS.scrollToTop) || "Scroll to top",
  };
  const purchaseState = getPurchaseState(product, selectedVariant, purchaseLabels);
  const displayPrice = selectedVariant?.price || product?.price;
  const productTitle = translate(product.titleTranslations) || product.title;
  const productDescription = translate(product.descriptionTranslations) || product.description;
  const preorderNote = translate(product.preorderNoteTranslations) || product.preorderNote;
  const productGallery = Array.isArray(product?.gallery) ? product.gallery : [];
  const hasProductGallery = productGallery.length > 0;
  const relatedProductLinks = relatedProducts.map((item) => ({
    label: translate(item?.titleTranslations) || item?.title || "",
    href: item?.href,
  }));

  return (
    <main className={styles.main}>
      <FilterHeader array={relatedProductLinks} currentlyActive={productTitle} />
      <BlurContainer>
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
              {/* {product?.isSubscription ? (
                <>
                  {displayPrice ? (
                    <p className={styles.price}>{formatPrice(displayPrice.amount, displayPrice.currencyCode)}</p>
                  ) : null}
                {Array.isArray(product?.sellingPlans) && product.sellingPlans.length > 1 ? (
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
                </>
              ) : null}
              {preorderNote ? <p className={styles.preorderNote}>{preorderNote}</p> : null} */}
            </div>
          </article>

          {hasProductGallery ? <div className={styles.sectionDivider} aria-hidden="true" /> : null}

          {hasProductGallery ? (
            <div className={styles.productGallery} ref={productGalleryRef}>
              <div className={styles.productTitle}>{productTitle}</div>
              <Satellite media={productGallery} behaviour="expand" className={styles.satellite} />
            </div>
          ) : null}

          <motion.div
            className={`${styles.navigationFooter} ${!hasProductGallery ? styles.navigationFooterNoGallery : ""} ${
              product?.isSubscription && variants.length > 1 ? styles.subscriptionFooter : ""
            }`}
            typo="longcopy"
          >
            {product?.isSubscription && variants.length > 1 ? (
              isMobileViewport ? (
                <div className={styles.subscriptionMobileStack}>
                  <motion.div
                    className={`${styles.variantFooter} ${styles.variantFooterMobile} ${
                      selectedVariantId ? styles.variantFooterWithCheckout : ""
                    }`}
                    animate={{ y: selectedVariantId ? 0 : 50 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {variants.map((variant) => {
                      const labelFromOptions =
                        variant.selectedOptions
                          ?.map((option) => option?.value)
                          .filter(Boolean)
                          .join(" / ") || variant.title;
                      const variantPrice = variant?.price ? formatPrice(variant.price.amount, variant.price.currencyCode) : null;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId((prev) => (prev === variant.id ? null : variant.id))}
                          className={`${styles.variantFooterButton} ${
                            selectedVariantId === variant.id ? styles.variantFooterButtonActive : ""
                          }`}
                        >
                          {variantPrice ? `${labelFromOptions} ${variantPrice}` : labelFromOptions}
                        </button>
                      );
                    })}
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {selectedVariantId ? (
                      <motion.button
                        key="mobile-subscription-checkout"
                        className={`${styles.addButton} ${styles.subscriptionCheckoutButtonMobile}`}
                        type="button"
                        onClick={addToCart}
                        disabled={!purchaseState.canAdd || !hasRequiredVariantSelection}
                        aria-busy={isAdding ? "true" : "false"}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        {isAdding ? purchaseLabels.addingToBasket : purchaseState.label}
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                <div className={`${styles.variantFooter} ${isLastVariantSelected ? styles.variantFooterLastSelected : ""}`}>
                  {variants.map((variant) => {
                    const labelFromOptions =
                      variant.selectedOptions
                        ?.map((option) => option?.value)
                        .filter(Boolean)
                        .join(" / ") || variant.title;
                    const variantPrice = variant?.price ? formatPrice(variant.price.amount, variant.price.currencyCode) : null;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`${styles.variantFooterButton} ${
                          selectedVariantId === variant.id ? styles.variantFooterButtonActive : ""
                        }`}
                      >
                        {variantPrice ? `${labelFromOptions} ${variantPrice}` : labelFromOptions}
                      </button>
                    );
                  })}
                </div>
              )
            ) : hasProductGallery ? (
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
                      {purchaseLabels.scrollToTop}
                    </motion.button>
                  ) : (
                    <motion.button
                      key="show-info"
                      className={styles.navActionLayer}
                      type="button"
                      onClick={scrollToGallery}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <span className={styles.backLink}>{purchaseLabels.showInfo}</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className={styles.navSpacer} aria-hidden="true" />
            )}
            {!(product?.isSubscription && variants.length > 1 && isMobileViewport) ? (
              <button
                className={`${styles.addButton} ${!hasProductGallery ? styles.addButtonNoGallery : ""}`}
                type="button"
                onClick={addToCart}
                disabled={!purchaseState.canAdd || !hasRequiredVariantSelection}
                aria-busy={isAdding ? "true" : "false"}
              >
                {isAdding ? purchaseLabels.addingToBasket : purchaseState.label}
              </button>
            ) : null}
          </motion.div>
        </div>
      </BlurContainer>

      <ShopIcon className={styles.shopIcon} />
    </main>
  );
};

export default ProductPage;
