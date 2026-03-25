import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const CART_STORAGE_KEY = "pinea_shopify_cart_id";
const BASKET_STATE_STORAGE_KEY = "pinea_shopify_basket_state";

const BasketButton = ({ isMobile, showMenu }) => {
  const [count, setCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const loadCartCount = useCallback(async () => {
    const storedBasket = window.localStorage.getItem(BASKET_STATE_STORAGE_KEY);
    if (storedBasket) {
      try {
        const parsed = JSON.parse(storedBasket);
        const savedCount = Number(parsed?.totalQuantity);
        if (Number.isFinite(savedCount)) {
          setCount(savedCount);
        }
      } catch {
        window.localStorage.removeItem(BASKET_STATE_STORAGE_KEY);
      }
    }

    const cartId = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!cartId) {
      if (!storedBasket) setCount(0);
      return;
    }

    try {
      const response = await fetch(`/api/shopify/cart?cartId=${encodeURIComponent(cartId)}`, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok || !payload?.cart) {
        if (!storedBasket) setCount(0);
        return;
      }

      const nextCount = payload.cart.totalQuantity || 0;
      setCount(nextCount);
      window.localStorage.setItem(BASKET_STATE_STORAGE_KEY, JSON.stringify(payload.cart));
    } catch {
      if (!storedBasket) setCount(0);
    }
  }, []);

  useEffect(() => {
    loadCartCount();

    const handleStorage = (event) => {
      if (!event?.key || event.key === CART_STORAGE_KEY || event.key === BASKET_STATE_STORAGE_KEY) {
        loadCartCount();
      }
    };

    const handleBasketUpdated = (event) => {
      const nextCount = event?.detail?.totalQuantity;
      if (typeof nextCount === "number") {
        setCount(nextCount);
        return;
      }

      loadCartCount();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("shopify-basket-updated", handleBasketUpdated);
    window.addEventListener("shopify-cart-updated", handleBasketUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("shopify-basket-updated", handleBasketUpdated);
      window.removeEventListener("shopify-cart-updated", handleBasketUpdated);
    };
  }, [loadCartCount]);

  const handleOpenBasket = () => {
    if (pathname.startsWith("/shop")) {
      window.dispatchEvent(new Event("shopify-basket-toggle"));
      return;
    }

    router.push("/shop?basket=open");
  };

  return (
    <AnimatePresence mode="popLayout">
      {(!isMobile || (isMobile && !showMenu)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0 } }}
        >
          <motion.button
            layout
            className="basketButton"
            type="button"
            onClick={handleOpenBasket}
            aria-label={`Basket with ${count} items`}
          >
            <span className="basketLabel">Basket</span>
            <span className="basketBadge" aria-hidden="true">
              {count}
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BasketButton;
