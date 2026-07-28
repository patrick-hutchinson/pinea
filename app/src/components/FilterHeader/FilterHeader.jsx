import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

import { StateContext } from "@/context/StateContext";
import { SearchContext } from "@/context/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import AnimationLink from "@/components/Animation/AnimationLink";
import { isPineaIssueTitle } from "@/helpers/isPineaIssueTitle";

import styles from "./FilterHeader.module.css";

const FilterHeaderContext = createContext({
  registerFilterHeader: () => {},
});

const getFilterHeaderSignature = (items = []) =>
  items
    .map((item) => {
      if (typeof item === "string") return item;
      return `${item?.label || ""}:${item?.href || ""}`;
    })
    .join("|");

const getRouteIdentity = (path = "") => path.split(/[?#]/)[0];
const stripRouteLocale = (path = "") => path.replace(/^\/(de|en)(?=\/|$)/, "") || "/";
const getFilterHeaderRoutePattern = (path = "") => {
  const cleanPath = stripRouteLocale(getRouteIdentity(path)).replace(/\/$/, "") || "/";

  if (/^\/shop\/[^/]+$/.test(cleanPath)) return "/shop/[slug]";

  return cleanPath;
};

const shouldPreFadeRouteChange = (fromPattern, toPattern) =>
  [fromPattern, toPattern].includes("/shop") &&
  [fromPattern, toPattern].includes("/shop/[slug]") &&
  fromPattern !== toPattern;

const FILTER_HEADER_FADE_DURATION = 400;

export const FilterHeaderProvider = ({ children }) => {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [isHiddenForRouteChange, setIsHiddenForRouteChange] = useState(false);
  const [shouldAnimateItemsIn, setShouldAnimateItemsIn] = useState(false);
  const routeChangeStartedRef = useRef(false);
  const acceptsRouteRegistrationsRef = useRef(true);
  const lastSignatureRef = useRef(null);
  const latestRegisteredPathRef = useRef(null);
  const latestRoutePatternRef = useRef(null);
  const routeChangeWasPreHiddenRef = useRef(false);
  const swapTimeoutRef = useRef(null);
  const missingHeaderTimeoutRef = useRef(null);

  const clearSwapTimeout = useCallback(() => {
    if (!swapTimeoutRef.current) return;

    window.clearTimeout(swapTimeoutRef.current);
    swapTimeoutRef.current = null;
  }, []);

  const clearMissingHeaderTimeout = useCallback(() => {
    if (!missingHeaderTimeoutRef.current) return;

    window.clearTimeout(missingHeaderTimeoutRef.current);
    missingHeaderTimeoutRef.current = null;
  }, []);

  const registerFilterHeader = useCallback(
    (nextConfig) => {
      const currentRouteIdentity = getRouteIdentity(router.asPath);

      if (routeChangeStartedRef.current && !acceptsRouteRegistrationsRef.current) return;
      if (nextConfig.ownerPath && getRouteIdentity(nextConfig.ownerPath) !== currentRouteIdentity) return;

      clearMissingHeaderTimeout();

      const previousSignature = lastSignatureRef.current;
      const didRouteChangeStart = routeChangeStartedRef.current;
      const didSignatureChange = previousSignature !== null && previousSignature !== nextConfig.signature;
      const didRoutePatternChange =
        latestRoutePatternRef.current !== null &&
        nextConfig.ownerRoutePattern &&
        latestRoutePatternRef.current !== nextConfig.ownerRoutePattern;
      const isSameShopProductRoute =
        latestRoutePatternRef.current === "/shop/[slug]" && nextConfig.ownerRoutePattern === "/shop/[slug]";
      const shouldAnimate = didRouteChangeStart && !isSameShopProductRoute && (didSignatureChange || didRoutePatternChange);

      latestRegisteredPathRef.current = currentRouteIdentity;
      latestRoutePatternRef.current = nextConfig.ownerRoutePattern || null;
      lastSignatureRef.current = nextConfig.signature;
      routeChangeStartedRef.current = false;

      clearSwapTimeout();

      if (shouldAnimate && routeChangeWasPreHiddenRef.current) {
        routeChangeWasPreHiddenRef.current = false;
        setConfig(nextConfig);
        setShouldAnimateItemsIn(true);
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => setIsHiddenForRouteChange(false)));
      } else if (shouldAnimate) {
        routeChangeWasPreHiddenRef.current = false;
        setShouldAnimateItemsIn(false);
        setIsHiddenForRouteChange(true);
        swapTimeoutRef.current = window.setTimeout(() => {
          setConfig(nextConfig);
          setShouldAnimateItemsIn(true);
          window.requestAnimationFrame(() => window.requestAnimationFrame(() => setIsHiddenForRouteChange(false)));
          swapTimeoutRef.current = null;
        }, FILTER_HEADER_FADE_DURATION);
      } else {
        routeChangeWasPreHiddenRef.current = false;
        setShouldAnimateItemsIn(false);
        setConfig(nextConfig);
        setIsHiddenForRouteChange(false);
      }
    },
    [clearMissingHeaderTimeout, clearSwapTimeout, router.asPath],
  );

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      clearSwapTimeout();
      clearMissingHeaderTimeout();
      const nextRoutePattern = getFilterHeaderRoutePattern(url);
      const shouldPreFade = shouldPreFadeRouteChange(latestRoutePatternRef.current, nextRoutePattern);

      routeChangeStartedRef.current = true;
      routeChangeWasPreHiddenRef.current = shouldPreFade;
      acceptsRouteRegistrationsRef.current = false;

      if (shouldPreFade) {
        setShouldAnimateItemsIn(false);
        setIsHiddenForRouteChange(true);
      }
    };

    const handleRouteChangeError = () => {
      clearSwapTimeout();
      clearMissingHeaderTimeout();
      routeChangeStartedRef.current = false;
      routeChangeWasPreHiddenRef.current = false;
      acceptsRouteRegistrationsRef.current = true;
      setIsHiddenForRouteChange(false);
    };

    const handlePageExitComplete = () => {
      acceptsRouteRegistrationsRef.current = true;
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeError", handleRouteChangeError);
    window.addEventListener("pinea-page-exit-complete", handlePageExitComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeError", handleRouteChangeError);
      window.removeEventListener("pinea-page-exit-complete", handlePageExitComplete);
    };
  }, [clearMissingHeaderTimeout, clearSwapTimeout, router.asPath, router.events]);

  useEffect(() => {
    const clearMissingFilterHeader = () => {
      clearMissingHeaderTimeout();

      missingHeaderTimeoutRef.current = window.setTimeout(() => {
        if (latestRegisteredPathRef.current === getRouteIdentity(router.asPath)) return;

        clearSwapTimeout();
        setConfig(null);
        setShouldAnimateItemsIn(false);
        setIsHiddenForRouteChange(false);
        routeChangeStartedRef.current = false;
        routeChangeWasPreHiddenRef.current = false;
        acceptsRouteRegistrationsRef.current = true;
        lastSignatureRef.current = null;
        latestRoutePatternRef.current = null;
        missingHeaderTimeoutRef.current = null;
      }, 120);
    };

    window.addEventListener("pinea-page-transition-complete", clearMissingFilterHeader);
    return () => window.removeEventListener("pinea-page-transition-complete", clearMissingFilterHeader);
  }, [clearMissingHeaderTimeout, clearSwapTimeout, router.asPath]);

  return (
    <FilterHeaderContext.Provider
      value={{
        config,
        isHiddenForRouteChange,
        registerFilterHeader,
        shouldAnimateItemsIn,
      }}
    >
      {children}
    </FilterHeaderContext.Provider>
  );
};

export const FilterHeaderRenderer = () => {
  const { config, isHiddenForRouteChange, shouldAnimateItemsIn } = useContext(FilterHeaderContext);
  const { isTouch } = useContext(StateContext);
  const { searchQuery } = useContext(SearchContext);

  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const dragStateRef = useRef({
    active: false,
    dragged: false,
    pointerId: null,
    pointerType: null,
    startX: 0,
    scrollLeft: 0,
  });

  const [overflowing, setOverflowing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const {
    activeScrollBehavior = "smooth",
    array = [],
    className,
    currentlyActive,
    handleFilter,
    hasDivider = true,
    notAllowed,
    scrollToTarget,
    signature,
  } = config || {};

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateOverflowState = () => {
      const nextOverflowing = el.scrollWidth > el.clientWidth + 1;

      setOverflowing(nextOverflowing);

      if (!nextOverflowing && el.scrollLeft !== 0) {
        el.scrollLeft = 0;
      }

      setShowLeftFade(el.scrollLeft > 0);
      setShowRightFade(nextOverflowing && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    updateOverflowState();
    el.addEventListener("scroll", updateOverflowState);
    window.addEventListener("resize", updateOverflowState);

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => updateOverflowState()) : null;
    resizeObserver?.observe(el);

    return () => {
      el.removeEventListener("scroll", updateOverflowState);
      window.removeEventListener("resize", updateOverflowState);
      resizeObserver?.disconnect();
    };
  }, [array]);

  const endDrag = () => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;

    if (container && dragState.pointerId != null && container.hasPointerCapture?.(dragState.pointerId)) {
      container.releasePointerCapture(dragState.pointerId);
    }

    dragState.active = false;
    dragState.pointerId = null;
    dragState.pointerType = null;
    setIsDragging(false);
  };

  const handlePointerDown = (event) => {
    const container = containerRef.current;
    if (!container || container.scrollWidth <= container.clientWidth) return;

    if (event.button != null && event.button !== 0) return;

    dragStateRef.current = {
      active: true,
      dragged: false,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    };
  };

  const handlePointerMove = (event) => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;
    if (!container || !dragState.active) return;

    const deltaX = event.clientX - dragState.startX;
    const dragThreshold = dragState.pointerType === "touch" || isTouch ? 8 : 3;

    if (Math.abs(deltaX) > dragThreshold) {
      dragState.dragged = true;
      setIsDragging(true);
    }

    if (!dragState.dragged) return;

    if (dragState.pointerType === "touch" || isTouch) return;

    event.preventDefault();
    container.scrollLeft = dragState.scrollLeft - deltaX;
  };

  const handleClickCapture = (event) => {
    if (!dragStateRef.current.dragged) return;

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.dragged = false;
  };

  useEffect(() => {
    const handleWindowPointerMove = (event) => handlePointerMove(event);
    const handleWindowPointerUp = () => endDrag();

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !currentlyActive) return;

    const activeItem = itemRefs.current[currentlyActive];
    if (!activeItem) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    if (itemRect.left >= containerRect.left && itemRect.right <= containerRect.right) return;

    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const centeredScrollLeft = activeItem.offsetLeft - (container.clientWidth - activeItem.offsetWidth) / 2;
    const targetScrollLeft = Math.max(0, Math.min(centeredScrollLeft, maxScrollLeft));

    if (Math.abs(container.scrollLeft - targetScrollLeft) < 1) return;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: activeScrollBehavior,
    });
  }, [activeScrollBehavior, currentlyActive, signature]);

  return (
    <AnimatePresence>
      {config && searchQuery.length <= 1 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`${styles.wrapper} ${!hasDivider ? styles.noDivider : ""}`}
        >
          <motion.ul
            key={signature}
            ref={containerRef}
            initial={{ opacity: shouldAnimateItemsIn ? 0 : 1 }}
            animate={{ opacity: isHiddenForRouteChange ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onPointerDownCapture={handlePointerDown}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={handleClickCapture}
            onDragStart={(event) => event.preventDefault()}
            style={{
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflowX: "auto",
              display: "flex",
              justifyContent: overflowing ? "flex-start" : "center",
            }}
            className={`${className} filterHeader ${styles.filter_header} ${isDragging ? styles.dragging : ""}`}
            typo="h3"
          >
            {array.map((item, index) => {
              const label = typeof item === "string" ? item : item.label;
              const href = typeof item === "string" ? null : item.href;
              const isActive = Array.isArray(currentlyActive) ? currentlyActive.includes(label) : currentlyActive === label;
              const labelClassName = isPineaIssueTitle(label) ? "pineaIssueTitle" : "";

              return (
                <li
                  key={`${label}-${href || index}`}
                  ref={(el) => (itemRefs.current[label] = el)}
                  className={`${isActive ? styles.active : ""} ${notAllowed}`}
                >
                  <motion.span
                    initial={{ opacity: shouldAnimateItemsIn ? 0 : 1 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: shouldAnimateItemsIn ? index * 0.025 : 0,
                    }}
                  >
                    {href && scrollToTarget ? (
                      <a
                        href={href}
                        className={`${styles.link} ${labelClassName}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToTarget(href, label);
                        }}
                      >
                        {label}
                      </a>
                    ) : href ? (
                      <AnimationLink path={href} className={`${styles.link} ${labelClassName}`}>
                        {label}
                      </AnimationLink>
                    ) : (
                      <span className={labelClassName} onClick={() => handleFilter?.(label)}>
                        {label}
                      </span>
                    )}

                    <span>{index < array.length - 1 && ", "}</span>
                  </motion.span>
                </li>
              );
            })}
          </motion.ul>

          {showLeftFade && (
            <motion.div
              className={styles.fade_left}
              animate={{ opacity: isHiddenForRouteChange ? 0 : 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          )}
          {showRightFade && (
            <motion.div
              className={styles.fade_right}
              animate={{ opacity: isHiddenForRouteChange ? 0 : 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FilterHeader = ({
  array,
  handleFilter,
  currentlyActive,
  className,
  scrollToTarget,
  notAllowed,
  activeScrollBehavior = "smooth",
}) => {
  const { registerFilterHeader } = useContext(FilterHeaderContext);
  const router = useRouter();
  const ownerPathRef = useRef(router.asPath);
  const ownerRoutePatternRef = useRef(router.pathname);

  const signature = useMemo(() => getFilterHeaderSignature(array), [array]);
  const hasDivider = !["/calendar", "/contributors", "/archive"].includes(router.pathname);

  useLayoutEffect(() => {
    registerFilterHeader({
      activeScrollBehavior,
      array,
      className,
      currentlyActive,
      handleFilter,
      hasDivider,
      notAllowed,
      ownerPath: ownerPathRef.current,
      ownerRoutePattern: ownerRoutePatternRef.current,
      scrollToTarget,
      signature,
    });
  }, [
    activeScrollBehavior,
    array,
    className,
    currentlyActive,
    handleFilter,
    hasDivider,
    notAllowed,
    registerFilterHeader,
    scrollToTarget,
    signature,
  ]);

  return null;
};

export default FilterHeader;
