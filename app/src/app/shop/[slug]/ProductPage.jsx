"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";

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

const ProductPage = ({ product, site }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isAtPageBottom, setIsAtPageBottom] = useState(false);
  const [basket, setBasket] = useState(null);
  const [basketError, setBasketError] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

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

  const addToCart = async () => {
    if (!product?.firstVariantId || isAdding) return;

    setFeedback(null);
    setIsAdding(true);

    try {
      const basketId = window.localStorage.getItem(BASKET_STORAGE_KEY);
      const response = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: basketId || null,
          merchandiseId: product.firstVariantId,
          quantity: 1,
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

  return (
    <main className={styles.main}>
      <FilterHeader array={["Edition 001"]} />
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
                <Media medium={product.primaryMedium} />
              </div>
            ) : (
              <div className={styles.imagePlaceholder}>
                <h2 className={styles.imagePlaceholderTitle} typo="h2">
                  {product.title}
                </h2>
              </div>
            )}
          </div>

          <div className={styles.content}>
            {product.description ? <Text text={product.description} typo="longcopy" className={styles.longcopy} /> : null}
            {/* <p className={styles.price}>{formatPrice(product.price.amount, product.price.currencyCode)}</p> */}

            {/* {feedback ? <p className={styles.feedback}>{feedback}</p> : null} */}
          </div>
        </article>

        <div className={styles.sectionDivider} aria-hidden="true" />

        <div>
          <div className={styles.productTitle}>{product.title}</div>
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
                <motion.div
                  key="see-more"
                  className={styles.navActionLayer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <Link href="/shop" className={styles.backLink}>
                    See More
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className={styles.addButton}
            type="button"
            onClick={addToCart}
            disabled={!product.availableForSale || isAdding}
          >
            {!product.availableForSale ? "Sold out" : isAdding ? "Adding..." : "Add to Shopping Basket"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
