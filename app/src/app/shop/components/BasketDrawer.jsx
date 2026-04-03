"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./BasketDrawer.module.css";
import Button from "@/components/Buttons/Button";
import Media from "@/components/Media/Media";

const formatPrice = (amount, currencyCode) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  }).format(value);
};

const BasketDrawer = ({ basket, isOpen, onOpen, onClose, pendingLineId, onChangeLineQuantity }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const drawer = (
    <>
      <div className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOverlayOpen : ""}`} onClick={onClose} />

      <aside className={`${styles.basketDrawer} ${isOpen ? styles.basketDrawerOpen : ""}`} aria-hidden={!isOpen}>
        <div className={styles.basketDrawerHeader}>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close basket">
            <img src="/icons/close.svg" alt="" width="30" height="30" />
          </button>
        </div>

        {basket?.totalQuantity ? (
          <div className={styles.basketContent}>
            <ul className={styles.basketList}>
              <AnimatePresence initial={false}>
                {basket.lines.map((line) => (
                  <motion.li
                    key={line.id}
                    className={styles.basketLine}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <div className={styles.basketMedia}>
                      {line.product.primaryMedium ? (
                        <Media medium={line.product.primaryMedium} objectFit="contain" />
                      ) : line?.product?.isSubscription ? (
                        <div className={styles.basketMediaSubscriptionCard}>
                          <span className={styles.basketMediaSubscriptionTitle}>{line?.product?.title || "SUBSCRIPTION"}</span>
                        </div>
                      ) : (
                        <div className={styles.basketMediaFallback} />
                      )}
                    </div>
                    <div className={styles.basketLineInfo}>
                      <span typo="h2">{line.product.title}</span>
                      <div className={styles.lineMeta}>
                        <span typo="h2" style={{ color: "#8D8A8A" }}>
                          {formatPrice(line.price.amount, line.price.currencyCode)}
                        </span>
                        <div className={styles.lineActions}>
                          <Button
                            className={`${styles.actionButton} ${styles.iconActionButton} ${pendingLineId === line.id ? styles.actionButtonDisabled : ""}`}
                            onClick={() => onChangeLineQuantity(line.id, line.quantity - 1)}
                            style={{ pointerEvents: pendingLineId === line.id ? "none" : "auto" }}
                            aria-label="Decrease quantity"
                          >
                            <img
                              src="/icons/subtract-button.svg"
                              alt=""
                              width={18.5}
                              height={18.5}
                              className={styles.actionIcon}
                            />
                          </Button>
                          <Button
                            className={`${styles.actionButton} ${styles.iconActionButton} ${pendingLineId === line.id ? styles.actionButtonDisabled : ""}`}
                            onClick={() => onChangeLineQuantity(line.id, line.quantity + 1)}
                            style={{ pointerEvents: pendingLineId === line.id ? "none" : "auto" }}
                            aria-label="Increase quantity"
                          >
                            <img
                              src="/icons/add-button.svg"
                              alt=""
                              width={18.5}
                              height={18.5}
                              className={styles.actionIcon}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className={styles.lineQuantity}>
                      <span
                        className={styles.quantityValue}
                        aria-busy={pendingLineId === line.id ? "true" : "false"}
                        typo="h4"
                      >
                        {line.quantity}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className={styles.basketFooter}>
              <div className={styles.basketSummaryRow}>
                <span typo="h4">
                  {basket.totalQuantity} item{basket.totalQuantity === 1 ? "" : "s"}
                </span>
                <span typo="h4">{formatPrice(basket.total.amount, basket.total.currencyCode)}</span>
              </div>
              <div className={styles.basketDivider} />
              <a
                className={styles.checkoutButton}
                href={basket.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                typo="longcopy"
              >
                CHECKOUT
              </a>
            </div>
          </div>
        ) : (
          <p className={styles.empty}>Your basket is empty.</p>
        )}
      </aside>
    </>
  );

  if (!mounted) return null;
  return createPortal(drawer, document.body);
};

export default BasketDrawer;
