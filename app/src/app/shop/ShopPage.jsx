"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import styles from "./ShopPage.module.css";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import AnimationLink from "@/components/Animation/AnimationLink";
import Media from "@/components/Media/Media";
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

const toCategoryLabel = (value) => {
  if (!value) return null;
  if (CATEGORY_LABELS[value]) return CATEGORY_LABELS[value];

  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const getPurchaseState = (product) => {
  const status = product?.releaseStatus;

  if (status === "coming_soon") {
    return { canAdd: false, label: "Coming soon" };
  }

  if (status === "preorder") {
    return { canAdd: Boolean(product?.availableForSale), label: "Pre-order" };
  }

  if (!product?.availableForSale) {
    return { canAdd: false, label: "Sold out" };
  }

  return { canAdd: true, label: null };
};

const ShopPage = ({ products = [], error }) => {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);

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
    const purchaseState = getPurchaseState(product);
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
              {visibleProducts.map((product) => (
                <motion.article
                  className={styles.card}
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
                  {(() => {
                    const purchaseState = getPurchaseState(product);
                    const productTitle = translate(product.titleTranslations) || product.title;

                    return (
                      <>
                  <AnimationLink path={`/shop/${product.handle}`} className={styles.cardLink}>
                    <div className={styles.mediaWrap}>
                      {product.primaryMedium ? (
                        <div className={styles.mediaWrap_inner}>
                          <Media medium={product.primaryMedium} objectFit="contain" />
                        </div>
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <h2 className={styles.imagePlaceholderTitle} typo="h3">
                            {productTitle}
                          </h2>
                        </div>
                      )}
                    </div>
                  </AnimationLink>

                  <div className={styles.cardBody}>
                    <AnimationLink path={`/shop/${product.handle}`} className={styles.titleLink}>
                      <div typo="h4" className={styles.productTitle}>
                        {productTitle}, {formatPrice(product.price.amount, product.price.currencyCode)}
                      </div>
                    </AnimationLink>
                    <div className={styles.cardActions}>
                      {purchaseState.label === "Pre-order" ? (
                        <Button className={styles.statusButton} style={{ pointerEvents: "none" }}>
                          {purchaseState.label}
                        </Button>
                      ) : purchaseState.label ? (
                        <div className={styles.statusLabel}>{purchaseState.label}</div>
                      ) : null}
                      <Button
                        className={styles.quickAddButton}
                        onClick={() => quickAddToCart(product)}
                        style={{
                          opacity: purchaseState.canAdd ? 1 : 0.4,
                          pointerEvents: purchaseState.canAdd ? "auto" : "none",
                        }}
                      >
                      {addingProductId === product.id ? (
                        "..."
                      ) : (
                        <img
                          src="/icons/add-button.svg"
                          alt="Add to basket"
                          width={14}
                          height={14}
                          className={styles.quickAddIcon}
                        />
                      )}
                      </Button>
                    </div>
                  </div>
                      </>
                    );
                  })()}
                </motion.article>
              ))}
            </AnimatePresence>
          </section>
        </LayoutGroup>
      </BlurContainer>

      <SitePineaIcon />
    </main>
  );
};

export default ShopPage;
