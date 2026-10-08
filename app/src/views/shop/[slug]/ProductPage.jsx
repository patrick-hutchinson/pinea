"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";
import { translate } from "@/helpers/translate";
import { convertToPlainText } from "@/helpers/convertToPlainText";
import { isPineaIssueTitle } from "@/helpers/isPineaIssueTitle";
import { formatShopPrice } from "@/helpers/formatShopPrice";
import { cartContainsSubscription } from "@/helpers/shopCart";
import { useLanguage } from "@/context/LanguageContext";
import { useLenisContext } from "@/context/LenisContext";

import styles from "./ProductPage.module.css";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Satellite from "@/components/Satellite/Satellite";
import BasketDrawer from "../components/BasketDrawer";
import ShopHolidayNotice from "../components/ShopHolidayNotice";
import ShopIcon from "@/components/PineaIcon/ShopIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import ComponentSlideshow from "@/components/Slideshow/ComponentSlideshow";
import TextFigure from "@/components/Figure/TextFigure";
import Button from "@/components/Buttons/Button";

const BASKET_STORAGE_KEY = "pinea_shopify_cart_id";
const BASKET_STATE_STORAGE_KEY = "pinea_shopify_basket_state";
const PRODUCT_FOOTER_HEIGHT = 50;
const GIFT_MESSAGE_MAX_LENGTH = 250;
const GIFT_FORM_TEXT_FADE_MS = 220;
const GIFT_FORM_SCALE_MS = 1000;

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

const PRODUCT_UI_LABELS = {
  basketErrorPrefix: [
    { _key: "de", value: "Warenkorb-Fehler" },
    { _key: "en", value: "Basket error" },
  ],
  subscriptionMissingSellingPlan: [
    { _key: "de", value: "Abo-Konfiguration ist unvollständig (fehlender Selling Plan)." },
    { _key: "en", value: "Subscription setup is incomplete (missing selling plan)." },
  ],
  subscriptionAlreadyInBasket: [
    { _key: "de", value: "Du kannst nur ein Membership Abo abschließen!" },
    { _key: "en", value: "You can only purchase one subscription!" },
  ],
  couldNotLoadBasket: [
    { _key: "de", value: "Warenkorb konnte nicht geladen werden." },
    { _key: "en", value: "Could not load basket." },
  ],
  couldNotAddProduct: [
    { _key: "de", value: "Produkt konnte nicht hinzugefügt werden." },
    { _key: "en", value: "Could not add product." },
  ],
  addedToBasket: [
    { _key: "de", value: "Zum Warenkorb hinzugefügt." },
    { _key: "en", value: "Added to basket." },
  ],
  couldNotUpdateBasket: [
    { _key: "de", value: "Warenkorb konnte nicht aktualisiert werden." },
    { _key: "en", value: "Could not update basket." },
  ],
  closeBasketAria: [
    { _key: "de", value: "Warenkorb schließen" },
    { _key: "en", value: "Close basket" },
  ],
  decreaseQuantityAria: [
    { _key: "de", value: "Menge verringern" },
    { _key: "en", value: "Decrease quantity" },
  ],
  increaseQuantityAria: [
    { _key: "de", value: "Menge erhöhen" },
    { _key: "en", value: "Increase quantity" },
  ],
  checkout: [
    { _key: "de", value: "KASSE" },
    { _key: "en", value: "CHECKOUT" },
  ],
  basketItem: [
    { _key: "de", value: "Artikel" },
    { _key: "en", value: "item" },
  ],
  basketItems: [
    { _key: "de", value: "Artikel" },
    { _key: "en", value: "items" },
  ],
  emptyBasket: [
    { _key: "de", value: "Dein Warenkorb ist leer." },
    { _key: "en", value: "Your basket is empty." },
  ],
  subscriptionFallback: [
    { _key: "de", value: "ABO" },
    { _key: "en", value: "SUBSCRIPTION" },
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

const isValidEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const isGiftMembershipProduct = (product, productTitle = "") => {
  const values = [product?.category, product?.handle, productTitle, product?.title].filter(Boolean).map((value) =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_"),
  );

  return values.some(
    (value) =>
      value === "gift_membership" ||
      value.includes("gift_membership") ||
      value.includes("membership_gift") ||
      value.includes("gift_a_membership"),
  );
};

const normalizeDescriptionHtml = (input) => {
  const raw = String(input || "")
    .replace(/\r\n/g, "\n")
    .trim();
  if (!raw) return "";

  let html = raw
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/<p[^>]*>/gi, "<p>")
    .replace(/<br\s*\/?>/gi, "<br />");

  if (!/<p[\s>]/i.test(html)) {
    const paragraphs = html
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => `<p>${part.replace(/\n/g, "<br />")}</p>`);

    return paragraphs.join("");
  }

  return html.replace(/<br\s*\/?>\s*(<br\s*\/?>\s*)+/gi, "</p><p>");
};

const resolveLocalizedValue = (value, language) => {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  const match =
    value.find((item) => item?._key === language) ||
    value.find((item) => item?._key === "en") ||
    value.find((item) => item?._key === "de") ||
    value[0];

  return match?.value || "";
};

const summarizeSanityInfoForDebug = (info = [], language) =>
  Array.isArray(info)
    ? info.map((infoItem, index) => {
        const title = resolveLocalizedValue(infoItem?.title, language);
        const text = resolveLocalizedValue(infoItem?.text, language);

        return {
          index,
          title,
          textLanguages: Array.isArray(infoItem?.text) ? infoItem.text.map((item) => item?._key).filter(Boolean) : [],
          textType: Array.isArray(text) ? "portable-text-array" : typeof text,
          textLength: convertToPlainText(text).length,
          textPreview: convertToPlainText(text).slice(0, 180),
        };
      })
    : [];

const ProductPage = ({
  product,
  relatedProducts = [],
  periodical = null,
  edition = null,
  matchDebug = null,
  shopPage = null,
}) => {
  const showHolidayNotice = shopPage?.showHolidayNotice !== false;
  const { language } = useLanguage();
  const lenis = useLenisContext();
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isAtPageBottom, setIsAtPageBottom] = useState(false);
  const [basket, setBasket] = useState(null);
  const [basketError, setBasketError] = useState(null);
  const [pendingLineId, setPendingLineId] = useState(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const mainRef = useRef(null);
  const containerRef = useRef(null);
  const mediaWrapRef = useRef(null);
  const productGalleryRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const stableViewportWidthRef = useRef(0);
  const giftFormTransitionRef = useRef(null);
  const initialRequiresVariantSelection = Boolean(
    (product?.isSubscription || isGiftMembershipProduct(product, product?.title)) && product?.variants?.length > 1,
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialRequiresVariantSelection ? null : product?.firstVariantId || null,
  );
  const [selectedSellingPlanId, setSelectedSellingPlanId] = useState(product?.defaultSellingPlanId || null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [giftFormPhase, setGiftFormPhase] = useState("closed");
  const [giftRecipientEmail, setGiftRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [giftPlaceholderMeasured, setGiftPlaceholderMeasured] = useState(false);
  const giftFormVisible = giftFormPhase !== "closed";
  const giftFormExpanded = ["openingExpand", "open", "closingTextOut"].includes(giftFormPhase);
  const giftFormContentVisible = ["open", "closingTextOut"].includes(giftFormPhase);
  const giftTitleVisible = ["closed", "openingTextOut"].includes(giftFormPhase);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const applyMatch = () => setIsMobileViewport(mediaQuery.matches);
    applyMatch();
    mediaQuery.addEventListener("change", applyMatch);
    return () => mediaQuery.removeEventListener("change", applyMatch);
  }, []);

  useEffect(() => {
    return () => {
      if (giftFormTransitionRef.current) {
        window.clearTimeout(giftFormTransitionRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const mediaWrap = mediaWrapRef.current;
    if (!mediaWrap) return undefined;

    const setPlaceholderSize = () => {
      const styles = window.getComputedStyle(mediaWrap);
      const availableWidth =
        mediaWrap.clientWidth - parseFloat(styles.paddingLeft || "0") - parseFloat(styles.paddingRight || "0");
      const availableHeight =
        mediaWrap.clientHeight - parseFloat(styles.paddingTop || "0") - parseFloat(styles.paddingBottom || "0");
      const width = Math.max(0, Math.min(availableWidth, availableHeight * 0.75));
      const height = width * (4 / 3);

      mediaWrap.style.setProperty("--gift-placeholder-width", `${width}px`);
      mediaWrap.style.setProperty("--gift-placeholder-height", `${height}px`);
      setGiftPlaceholderMeasured(true);
    };

    setPlaceholderSize();

    const resizeObserver = new ResizeObserver(setPlaceholderSize);
    resizeObserver.observe(mediaWrap);
    window.addEventListener("resize", setPlaceholderSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", setPlaceholderSize);
    };
  }, [product?.id]);

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
        throw new Error(payload?.error || uiLabels.couldNotLoadBasket);
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
    const requiresVariantSelection = Boolean(
      (product?.isSubscription || isGiftMembershipProduct(product, product?.title)) && product?.variants?.length > 1,
    );
    setSelectedVariantId(requiresVariantSelection ? null : product?.firstVariantId || null);
    setSelectedSellingPlanId(product?.defaultSellingPlanId || null);
  }, [
    product?.id,
    product?.isSubscription,
    product?.variants?.length,
    product?.firstVariantId,
    product?.defaultSellingPlanId,
  ]);

  const addToCart = async ({ giftAttributes = [] } = {}) => {
    if (!selectedVariantId || isAdding) return false;
    if (product?.isSubscription && cartContainsSubscription(basket)) {
      window.alert(uiLabels.subscriptionAlreadyInBasket);
      return false;
    }
    const resolvedSellingPlanId = product?.isSubscription
      ? selectedSellingPlanId || product?.defaultSellingPlanId || null
      : null;
    if (product?.isSubscription && !resolvedSellingPlanId) {
      setFeedback(uiLabels.subscriptionMissingSellingPlan);
      return false;
    }

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
          sellingPlanId: resolvedSellingPlanId,
          requiresSellingPlan: Boolean(product?.isSubscription),
          attributes: giftAttributes,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        if (payload?.error === uiLabels.subscriptionAlreadyInBasket) {
          window.alert(uiLabels.subscriptionAlreadyInBasket);
          return false;
        }

        throw new Error(payload?.error || uiLabels.couldNotAddProduct);
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

      setFeedback(uiLabels.addedToBasket);
      return true;
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : uiLabels.couldNotAddProduct);
      return false;
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
        throw new Error(payload?.error || uiLabels.couldNotUpdateBasket);
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

  const scrollToTop = () => {
    if (isMobileViewport && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { duration: 0.8 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToGallery = () => {
    if (!productGalleryRef.current) return;

    if (isMobileViewport && containerRef.current) {
      containerRef.current.scrollTo({ top: productGalleryRef.current.offsetTop, behavior: "smooth" });
      return;
    }

    if (lenis?.scrollTo) {
      lenis.scrollTo(productGalleryRef.current, { duration: 0.8, offset: 0 });
      return;
    }

    productGalleryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const productTitle = translate(product.titleTranslations) || product.title;
  const isGiftProduct = isGiftMembershipProduct(product, productTitle);
  const hasSelectableVariants = (product?.isSubscription || isGiftProduct) && variants.length > 1;
  const lastVariantId = variants.length > 0 ? variants[variants.length - 1]?.id : null;
  const isLastVariantSelected = Boolean(selectedVariantId && lastVariantId && selectedVariantId === lastVariantId);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || null;
  const hasRequiredVariantSelection = !hasSelectableVariants || Boolean(selectedVariantId);
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
  const uiLabels = {
    basketErrorPrefix: translate(PRODUCT_UI_LABELS.basketErrorPrefix) || "Basket error",
    subscriptionMissingSellingPlan:
      translate(PRODUCT_UI_LABELS.subscriptionMissingSellingPlan) ||
      "Subscription setup is incomplete (missing selling plan).",
    subscriptionAlreadyInBasket:
      translate(PRODUCT_UI_LABELS.subscriptionAlreadyInBasket) || "You can only purchase one subscription!",
    couldNotLoadBasket: translate(PRODUCT_UI_LABELS.couldNotLoadBasket) || "Could not load basket.",
    couldNotAddProduct: translate(PRODUCT_UI_LABELS.couldNotAddProduct) || "Could not add product.",
    addedToBasket: translate(PRODUCT_UI_LABELS.addedToBasket) || "Added to basket.",
    couldNotUpdateBasket: translate(PRODUCT_UI_LABELS.couldNotUpdateBasket) || "Could not update basket.",
    closeBasketAria: translate(PRODUCT_UI_LABELS.closeBasketAria) || "Close basket",
    decreaseQuantityAria: translate(PRODUCT_UI_LABELS.decreaseQuantityAria) || "Decrease quantity",
    increaseQuantityAria: translate(PRODUCT_UI_LABELS.increaseQuantityAria) || "Increase quantity",
    checkout: translate(PRODUCT_UI_LABELS.checkout) || "CHECKOUT",
    basketItem: translate(PRODUCT_UI_LABELS.basketItem) || "item",
    basketItems: translate(PRODUCT_UI_LABELS.basketItems) || "items",
    emptyBasket: translate(PRODUCT_UI_LABELS.emptyBasket) || "Your basket is empty.",
    subscriptionFallback: translate(PRODUCT_UI_LABELS.subscriptionFallback) || "SUBSCRIPTION",
  };
  const purchaseState = getPurchaseState(product, selectedVariant, purchaseLabels);
  const subscriptionAlreadyInBasket = Boolean(product?.isSubscription && cartContainsSubscription(basket));
  const addButtonLabel = subscriptionAlreadyInBasket
    ? uiLabels.subscriptionAlreadyInBasket
    : isAdding
      ? purchaseLabels.addingToBasket
      : purchaseState.label;
  const displayPrice = selectedVariant?.price || product?.price;
  const canSaveGift = isValidEmail(giftRecipientEmail) && hasRequiredVariantSelection && purchaseState.canAdd;
  const clearGiftTransition = () => {
    if (!giftFormTransitionRef.current) return;
    window.clearTimeout(giftFormTransitionRef.current);
    giftFormTransitionRef.current = null;
  };
  const openGiftForm = () => {
    setFeedback(null);
    clearGiftTransition();
    setGiftFormPhase("openingTextOut");
    giftFormTransitionRef.current = window.setTimeout(() => {
      setGiftFormPhase("openingExpand");
      giftFormTransitionRef.current = window.setTimeout(() => {
        setGiftFormPhase("open");
        giftFormTransitionRef.current = null;
      }, GIFT_FORM_SCALE_MS);
    }, GIFT_FORM_TEXT_FADE_MS);
  };
  const closeGiftForm = ({ clearFields = false } = {}) => {
    clearGiftTransition();
    setGiftFormPhase("closingTextOut");
    giftFormTransitionRef.current = window.setTimeout(() => {
      setGiftFormPhase("closingCollapse");
      giftFormTransitionRef.current = window.setTimeout(() => {
        setGiftFormPhase("closed");
        if (clearFields) {
          setGiftRecipientEmail("");
          setGiftMessage("");
        }
        giftFormTransitionRef.current = null;
      }, GIFT_FORM_SCALE_MS);
    }, GIFT_FORM_TEXT_FADE_MS);
  };
  const cancelGiftForm = () => {
    closeGiftForm({ clearFields: true });
    setFeedback(null);
  };
  const saveGiftForm = async (event) => {
    event.preventDefault();
    if (!canSaveGift) return;

    setFeedback(null);

    try {
      const reference =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const added = await addToCart({
        giftAttributes: [
          { key: "gift_recipient_email", value: giftRecipientEmail.trim() },
          { key: "gift_message", value: giftMessage.trim() },
          { key: "gift_reference", value: reference },
        ],
      });
      if (added) {
        closeGiftForm({ clearFields: true });
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : uiLabels.couldNotAddProduct);
    }
  };
  const productTitleClassName = isPineaIssueTitle(productTitle) ? "pineaIssueTitle" : "";
  const productDescription = translate(product.descriptionTranslations) || product.description;
  const productDescriptionHtml = translate(product.descriptionHtmlTranslations) || product.descriptionHtml || "";
  const normalizedProductDescriptionHtml = normalizeDescriptionHtml(productDescriptionHtml);
  const sanityInfoSource = periodical || edition || null;
  const sanityInfo = Array.isArray(sanityInfoSource?.info) ? sanityInfoSource.info : [];
  const hasSanityInfo = sanityInfo.length > 0;
  const preorderNote = translate(product.preorderNoteTranslations) || product.preorderNote;
  const productGallery = Array.isArray(product?.gallery) ? product.gallery : [];
  const hasProductGallery = productGallery.length > 0;
  const relatedProductLinks = relatedProducts.map((item) => ({
    label: translate(item?.titleTranslations) || item?.title || "",
    href: item?.href,
  }));

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return undefined;

    let resizeFrame = null;

    const refreshLenis = () => {
      if (!lenis?.resize) return;
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => lenis.resize());
    };

    const setStableViewport = (force = false) => {
      const viewportWidth = window.innerWidth;

      // iOS changes innerHeight while browser chrome moves. Width changes are the
      // reliable signal that the layout itself should be recalculated.
      if (!force && stableViewportWidthRef.current === viewportWidth) return;

      stableViewportWidthRef.current = viewportWidth;
      mainElement.style.setProperty("--shop-product-stable-vh", `${window.innerHeight}px`);
      refreshLenis();
    };

    const handleResize = () => setStableViewport(false);
    const handleOrientationChange = () => {
      stableViewportWidthRef.current = 0;
      window.requestAnimationFrame(() => setStableViewport(true));
    };

    setStableViewport(true);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [lenis, product?.id]);

  useEffect(() => {
    const sentinel = bottomSentinelRef.current;

    if (!sentinel || !hasProductGallery) {
      setIsAtPageBottom(false);
      return undefined;
    }

    const root = isMobileViewport ? containerRef.current : null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtPageBottom(entry.isIntersecting);
      },
      {
        root,
        rootMargin: `0px 0px -${PRODUCT_FOOTER_HEIGHT}px 0px`,
        threshold: 0.01,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasProductGallery, isMobileViewport, product?.id]);

  useEffect(() => {
    if (!lenis?.resize) return;

    const resizeFrame = window.requestAnimationFrame(() => lenis.resize());
    return () => window.cancelAnimationFrame(resizeFrame);
  }, [hasProductGallery, hasSanityInfo, isMobileViewport, lenis, product?.id]);

  useEffect(() => {
    console.log("[shop/product] Sanity match debug", {
      language,
      product: {
        id: product?.id || null,
        handle: product?.handle || null,
        category: product?.category || null,
        title: productTitle,
        isSubscription: Boolean(product?.isSubscription),
        releaseStatus: product?.releaseStatus || null,
        availableForSale: Boolean(product?.availableForSale),
        shopifyProductAvailableForSale: Boolean(product?.shopifyProductAvailableForSale),
        requiresSellingPlan: Boolean(product?.requiresSellingPlan),
        firstVariantId: product?.firstVariantId || null,
        variants: Array.isArray(product?.variants)
          ? product.variants.map((variant) => ({
              id: variant?.id || null,
              title: variant?.title || null,
              availableForSale: Boolean(variant?.availableForSale),
              shopifyAvailableForSale: Boolean(variant?.shopifyAvailableForSale),
              currentlyNotInStock: Boolean(variant?.currentlyNotInStock),
            }))
          : [],
      },
      serverMatchDebug: matchDebug,
      receivedSanity: {
        hasPeriodical: Boolean(periodical),
        periodicalId: periodical?._id || null,
        periodicalInfoCount: Array.isArray(periodical?.info) ? periodical.info.length : 0,
        hasEdition: Boolean(edition),
        editionId: edition?._id || null,
        editionInfoCount: Array.isArray(edition?.info) ? edition.info.length : 0,
      },
      renderDecision: {
        sanityInfoSourceType: periodical ? "periodical" : edition ? "edition" : null,
        sanityInfoSourceId: sanityInfoSource?._id || null,
        sanityInfoCount: sanityInfo.length,
        hasSanityInfo,
        fallback: hasSanityInfo
          ? "ComponentSlideshow"
          : normalizedProductDescriptionHtml
            ? "Shopify descriptionHtml"
            : "Shopify description",
        descriptionHtmlLength: normalizedProductDescriptionHtml.length,
        descriptionTextLength: typeof productDescription === "string" ? productDescription.length : 0,
      },
      sanityInfoBlocks: summarizeSanityInfoForDebug(sanityInfo, language),
    });
  }, [
    edition,
    hasSanityInfo,
    language,
    matchDebug,
    normalizedProductDescriptionHtml,
    periodical,
    product?.category,
    product?.handle,
    product?.id,
    product?.isSubscription,
    productDescription,
    productTitle,
    sanityInfo,
    sanityInfoSource,
  ]);

  return (
    <main className={styles.main} ref={mainRef} style={{ "--shop-notice-height": showHolidayNotice ? "35px" : "0px" }}>
      <FilterHeader array={relatedProductLinks} currentlyActive={productTitle} />
      <ShopHolidayNotice show={showHolidayNotice} text={shopPage?.holidayNotice} />

      <div className={styles.container} ref={containerRef}>
        {basketError ? (
          <p className={styles.error}>
            {uiLabels.basketErrorPrefix}: {basketError}
          </p>
        ) : null}

        <BasketDrawer
          basket={basket}
          isOpen={isBasketOpen}
          onOpen={() => setIsBasketOpen(true)}
          onClose={() => setIsBasketOpen(false)}
          pendingLineId={pendingLineId}
          onChangeLineQuantity={changeLineQuantity}
          labels={{
            closeBasketAria: uiLabels.closeBasketAria,
            subscriptionFallback: uiLabels.subscriptionFallback,
            decreaseQuantityAria: uiLabels.decreaseQuantityAria,
            increaseQuantityAria: uiLabels.increaseQuantityAria,
            checkout: uiLabels.checkout,
            item: uiLabels.basketItem,
            items: uiLabels.basketItems,
            emptyBasket: uiLabels.emptyBasket,
          }}
        />

        <article className={styles.product}>
          <div ref={mediaWrapRef} className={`${styles.mediaWrap} ${giftFormExpanded ? styles.mediaWrapGiftFormOpen : ""}`}>
            {product.primaryMedium && !giftFormVisible ? (
              <div className={styles.primaryMediumWrapper}>
                <Media medium={product.primaryMedium} objectFit="contain" />
              </div>
            ) : (
              <div
                className={`${styles.imagePlaceholder} ${
                  giftPlaceholderMeasured ? styles.imagePlaceholderMeasured : ""
                } ${giftFormExpanded ? styles.imagePlaceholderGiftFormOpen : ""}`}
              >
                <AnimatePresence mode="wait">
                  {giftFormContentVisible ? (
                    <motion.div
                      key="gift-content"
                      typo="h3"
                      className={styles.giftContent}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: giftFormPhase === "open" ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: GIFT_FORM_TEXT_FADE_MS / 1000, ease: "easeInOut" }}
                    >
                      <form id="gift-membership-form" className={styles.giftForm} onSubmit={saveGiftForm}>
                        <div className={`${styles.giftProductName} ${productTitleClassName}`}>{productTitle}</div>
                        <textarea
                          className={styles.giftMessage}
                          value={giftMessage}
                          onChange={(event) => setGiftMessage(event.target.value.slice(0, GIFT_MESSAGE_MAX_LENGTH))}
                          maxLength={GIFT_MESSAGE_MAX_LENGTH}
                          placeholder={language === "de" ? "Nachricht (optional)" : "Message (optional)"}
                        />
                        <input
                          className={styles.giftEmail}
                          type="email"
                          value={giftRecipientEmail}
                          onChange={(event) => setGiftRecipientEmail(event.target.value)}
                          placeholder={
                            language === "de" ? "E-Mail-Adresse des Empfängers" : "Email address of the recipient"
                          }
                          required
                        />
                        {feedback ? <p className={styles.giftFeedback}>{feedback}</p> : null}
                      </form>
                    </motion.div>
                  ) : giftTitleVisible ? (
                    <motion.div
                      key="gift-title"
                      typo="h3"
                      className={`${styles.imagePlaceholderTitle} ${productTitleClassName}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: giftFormPhase === "closed" ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: GIFT_FORM_TEXT_FADE_MS / 1000, ease: "easeInOut" }}
                    >
                      {productTitle}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <AnimatePresence>
                  {giftFormContentVisible ? (
                    <motion.div
                      key="gift-actions"
                      typo="h3"
                      className={styles.giftActions}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: giftFormPhase === "open" ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: GIFT_FORM_TEXT_FADE_MS / 1000, ease: "easeInOut" }}
                    >
                      <Button className={styles.giftActionButton} onClick={cancelGiftForm}>
                        {language === "de" ? "Abbrechen" : "Cancel"}
                      </Button>
                      <Button
                          className={styles.giftActionButton}
                          type="submit"
                          form="gift-membership-form"
                          disabled={!canSaveGift || isAdding}
                        >
                          {language === "de" ? "Speichern" : "Save"}
                        </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className={`${styles.content} ${hasSanityInfo ? styles.periodicalInfoContent : ""}`}>
            {hasSanityInfo ? (
              <div className={`${styles.periodicalInfoFigure} textFigure`}>
                <ComponentSlideshow>
                  {sanityInfo.map((infoItem, index) => {
                    const above = { title: convertToPlainText(translate(infoItem.title)) };
                    const content = translate(infoItem.text);

                    return (
                      <TextFigure
                        key={`${sanityInfoSource?._id || product?.id || "shop-product"}-info-${index}`}
                        above={above}
                        content={content}
                      />
                    );
                  })}
                </ComponentSlideshow>
              </div>
            ) : normalizedProductDescriptionHtml ? (
              <div className={styles.longcopy} dangerouslySetInnerHTML={{ __html: normalizedProductDescriptionHtml }} />
            ) : productDescription ? (
              <Text
                text={productDescription}
                typo="longcopy"
                className={styles.longcopy}
                style={{ whiteSpace: "pre-wrap" }}
              />
            ) : null}
          </div>
        </article>

        {hasProductGallery ? <div className={styles.sectionDivider} aria-hidden="true" /> : null}

        {hasProductGallery ? (
          <div className={styles.productGallery} ref={productGalleryRef}>
            <Satellite media={productGallery} behaviour="expand" className={styles.satellite} />
          </div>
        ) : null}

        <div ref={bottomSentinelRef} className={styles.bottomSentinel} aria-hidden="true" />
      </div>

      <motion.div
        className={`${styles.navigationFooter} ${!hasProductGallery ? styles.navigationFooterNoGallery : ""} ${
          hasSelectableVariants ? styles.subscriptionFooter : ""
        }`}
        typo="longcopy"
      >
        {hasSelectableVariants ? (
          isMobileViewport ? (
            <div className={styles.subscriptionMobileStack}>
              <motion.div
                className={`${styles.variantFooter} ${styles.variantFooterMobile} ${
                  selectedVariantId ? styles.variantFooterWithCheckout : ""
                }`}
              >
                {variants.map((variant) => {
                  const labelFromOptions =
                    variant.selectedOptions
                      ?.map((option) => option?.value)
                      .filter(Boolean)
                      .join(" / ") || variant.title;
                  const variantPrice = variant?.price
                    ? formatShopPrice(variant.price.amount, variant.price.currencyCode, language)
                    : null;

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
                    onClick={isGiftProduct ? openGiftForm : addToCart}
                    disabled={!purchaseState.canAdd || !hasRequiredVariantSelection || giftFormVisible}
                    aria-busy={isAdding ? "true" : "false"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {addButtonLabel}
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
                const variantPrice = variant?.price
                  ? formatShopPrice(variant.price.amount, variant.price.currencyCode, language)
                  : null;

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
                  onClick={scrollToTop}
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
        {!(hasSelectableVariants && isMobileViewport) ? (
          <button
            className={`${styles.addButton} ${!hasProductGallery ? styles.addButtonNoGallery : ""}`}
            type="button"
            onClick={isGiftProduct ? openGiftForm : addToCart}
            disabled={!purchaseState.canAdd || !hasRequiredVariantSelection || giftFormVisible}
            aria-busy={isAdding ? "true" : "false"}
          >
            {addButtonLabel}
          </button>
        ) : null}
      </motion.div>

      <ShopIcon className={styles.shopIcon} />
    </main>
  );
};

export default ProductPage;
