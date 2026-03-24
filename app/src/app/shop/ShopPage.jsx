"use client";

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

const ShopPage = ({ products = [], error }) => {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

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
    if (!product?.firstVariantId || !product?.availableForSale || addingProductId) return;

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

  return (
    <main className={styles.main}>
      <FilterHeader array={["Editions", "Periodicals", "Memberships"]} />
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

        {!error && products.length === 0 ? <p className={styles.empty}>No products found.</p> : null}

        <section className={styles.grid}>
          {products.map((product) => (
            <article className={styles.card} key={product.id}>
              <AnimationLink path={`/shop/${product.handle}`} className={styles.cardLink}>
                <div className={styles.mediaWrap}>
                  {product.primaryMedium ? (
                    <div className={styles.mediaWrap_inner}>
                      <Media medium={product.primaryMedium} />
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <h2 className={styles.imagePlaceholderTitle} typo="h3">
                        {product.title}
                      </h2>
                    </div>
                  )}
                </div>
              </AnimationLink>

              <div className={styles.cardBody}>
                <AnimationLink path={`/shop/${product.handle}`} className={styles.titleLink}>
                  <div typo="h4" className={styles.productTitle}>
                    {product.title}, {formatPrice(product.price.amount, product.price.currencyCode)}
                  </div>
                </AnimationLink>
                <Button className={styles.quickAddButton} onClick={() => quickAddToCart(product)}>
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
            </article>
          ))}
        </section>
      </BlurContainer>

      <SitePineaIcon />
    </main>
  );
};

export default ShopPage;
