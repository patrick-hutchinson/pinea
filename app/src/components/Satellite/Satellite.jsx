"use client";

import { useContext, useEffect, useState, useRef } from "react";

import { motion, useInView } from "framer-motion";

import { useRadius } from "@/hooks/useRadius";

import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";

import { translate } from "@/helpers/translate";

import SatelliteShrink from "@/components/ShrinkMedia/SatelliteShrink";
import SatelliteExpand from "../ExpandMedia/SatelliteExpand";

import Text from "@/components/Text/Text";
import Control from "./Control";

import styles from "./Satellite.module.css";

const Satellite = ({ media, className, slugs, captions, behaviour }) => {
  const { isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);

  const inertiaRef = useRef(null);

  const container = useRef(null);

  const [isHolding, setIsHolding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const [currentMedia, setCurrentMedia] = useState(0);

  const [base, setBase] = useState(0);
  const [activeElement, setActiveElement] = useState(0);

  const mediaCount = media.length;
  const theta = 360 / mediaCount;
  const radius = useRadius(mediaCount, deviceDimensions.width);

  const isInView = useInView(container, { margin: "-40% 0px -40% 0px", once: false });

  const circularDistance = (a, b) => {
    const diff = Math.abs(a - b);
    return Math.min(diff, mediaCount - diff);
  };

  useEffect(() => {
    if (!isInView) return;

    setIsSettling(true);

    setActiveElement((prev) => {
      const next = (prev + 1) % mediaCount;

      setCurrentMedia((prevMedia) => {
        const roundedPrev = Math.round(prevMedia);
        const diff = next - normalizeIndex(roundedPrev, mediaCount);

        const shortest = diff > mediaCount / 2 ? diff - mediaCount : diff < -mediaCount / 2 ? diff + mediaCount : diff;

        return prevMedia + shortest;
      });

      return next;
    });
  }, [isInView, mediaCount]);

  useEffect(() => {
    if (!Array.isArray(media) || media.length === 0) return;

    let isCancelled = false;
    const maxConcurrent = 2;
    let active = 0;
    let cursor = 0;

    const viewportWidth = deviceDimensions?.width || (typeof window !== "undefined" ? window.innerWidth : 1200);
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const prefetchWidth = Math.round(Math.min(isMobile ? 1400 : 2200, viewportWidth * dpr * (isMobile ? 1.1 : 1.25)));

    const imageUrls = media
      .map((item) => item?.medium)
      .filter((m) => m?.type === "image" && typeof m?.url === "string")
      .map((m) => `${m.url}?w=${prefetchWidth}&fit=max&auto=format`);

    const runNext = () => {
      if (isCancelled) return;

      while (active < maxConcurrent && cursor < imageUrls.length) {
        const src = imageUrls[cursor++];
        active += 1;

        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        img.src = src;

        const done = () => {
          active -= 1;
          runNext();
        };

        img.onload = done;
        img.onerror = done;
      }
    };

    runNext();

    return () => {
      isCancelled = true;
    };
  }, [media, deviceDimensions?.width, isMobile]);

  const normalizeIndex = (value, mediaCount) => {
    return ((value % mediaCount) + mediaCount) % mediaCount;
  };

  const snapToNearest = () => {
    setCurrentMedia((prev) => {
      const nearest = Math.round(prev);
      const normalized = normalizeIndex(nearest, mediaCount);
      setBase(nearest);
      setActiveElement(normalized);
      return nearest;
    });
    setIsSettling(false);
  };

  const handleDragStart = () => {
    setIsSettling(true);
    setIsDragging(true);

    setBase(currentMedia);
    setActiveElement(normalizeIndex(Math.round(currentMedia), mediaCount));
  };

  const handleDrag = (e, info) => {
    // 1 = normal, <1 = more resistance
    const mobileResistance = (1 / mediaCount) * 1.2;
    const desktopResistnace = 0.2;

    const dragResistance = isMobile ? mobileResistance : desktopResistnace;
    const delta = (info.offset.x / window.innerWidth) * mediaCount * dragResistance;
    setCurrentMedia(normalizeIndex(base - delta, mediaCount));
  };

  const handleDragEnd = (e, info) => {
    setIsDragging(false);
    setIsSettling(true);

    // TAKE velocity.x (not whole object)
    const v = info.velocity.x;

    // Convert velocity to rotation factor
    const factor = (v / window.innerWidth) * mediaCount;

    // DON'T snap here — inertia will handle that
    startInertia(factor);
  };

  const startInertia = (initialFactor) => {
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);

    const multiplier = isMobile ? 0.05 : 0.2;

    let factor = initialFactor * multiplier; // scale down velocity
    let currentValue = currentMedia;
    const decay = isMobile ? 0.025 : 0.1;
    const threshold = 0.001;

    const tick = () => {
      currentValue = currentValue - factor;
      setCurrentMedia(currentValue);

      factor *= decay;

      if (Math.abs(factor) < threshold) {
        const nearest = Math.round(currentValue);
        setCurrentMedia(nearest);
        setBase(nearest);
        setActiveElement(normalizeIndex(nearest, mediaCount));

        return;
      }

      inertiaRef.current = requestAnimationFrame(tick);
    };

    inertiaRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      setIsSettling(true);

      setActiveElement((prev) => {
        let newIndex;
        if (e.key === "ArrowRight") {
          newIndex = (prev + 1) % mediaCount;
        } else if (e.key === "ArrowLeft") {
          newIndex = (prev - 1 + mediaCount) % mediaCount;
        } else {
          return prev; // other keys do nothing
        }

        // update currentMedia based on shortest distance
        setCurrentMedia((prevMedia) => {
          const roundedPrev = Math.round(prevMedia);
          const diff = newIndex - normalizeIndex(roundedPrev, mediaCount);
          const shortest = diff > mediaCount / 2 ? diff - mediaCount : diff < -mediaCount / 2 ? diff + mediaCount : diff;

          return prevMedia + shortest;
        });

        return newIndex;
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mediaCount]); // make sure mediaCount is up to date

  // Keep active marker/pointer target synced to the nearest visible item.
  useEffect(() => {
    const nearest = normalizeIndex(Math.round(currentMedia), mediaCount);
    setActiveElement((prev) => (prev === nearest ? prev : nearest));
  }, [currentMedia, mediaCount]);

  // Detect the end of the wheel animation
  useEffect(() => {
    const wheelEl = container.current?.querySelector(`.${styles.wheel}`);
    if (!wheelEl) return;
    const handleWheelTransitionEnd = (e) => {
      if (e.propertyName === "transform") {
        setIsSettling(false);
      }
    };

    wheelEl.addEventListener("transitionend", handleWheelTransitionEnd);

    return () => wheelEl.removeEventListener("transitionend", handleWheelTransitionEnd);
  }, []);

  // Recover interaction state if transitions are interrupted by tab/window changes.
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        snapToNearest();
      }
    };

    const handleResize = () => {
      snapToNearest();
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      window.removeEventListener("resize", handleResize);
    };
  }, [mediaCount]);

  return (
    <motion.div
      id={styles.container}
      className={className}
      ref={container}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={(e, info) => handleDrag(e, info)}
      onDragEnd={(e, info) => handleDragEnd(e, info)}
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
    >
      <div className={styles.wheel_container}>
        <div
          className={styles.wheel}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${-theta * currentMedia}deg)`,
            transition: isDragging ? "none" : "transform 1.5s cubic-bezier(0.35, 0.90, 0.50, 1)",
            width: `${deviceDimensions.width}px`,
          }}
          // onTransitionEnd={() => handleTransitionEnd()}
        >
          {media.map((medium, index) => {
            const isCurrent = index === activeElement;
            const isNearCurrent = circularDistance(index, activeElement) <= 1;
            const shouldEagerLoad = isCurrent || isNearCurrent;

            return (
              <motion.div
                key={index}
                className={styles.media_container}
                id={index}
                style={{
                  transform: `rotateY(${theta * index}deg) translateZ(${radius}px)`,
                  zIndex: index === activeElement ? 10 : 0,
                  pointerEvents: index === activeElement ? "all" : "none",
                  backfaceVisibility: "visible",
                }}
              >
                {behaviour === "expand" ? (
                  <SatelliteExpand
                    isHolding={isHolding}
                    medium={medium.medium}
                    copyright={<Text text={translate(medium.medium.copyrightInternational)} />}
                    activeElement={activeElement}
                    hasLanded={isInView && !isSettling && index === activeElement}
                    isActive={isCurrent}
                    loadEager={shouldEagerLoad}
                  />
                ) : (
                  <SatelliteShrink
                    caption={<Text text={translate(captions[index])} typo="h4" />}
                    medium={medium.medium}
                    hasLanded={!isSettling && index === activeElement}
                    path={`/stories/portfolios/${slugs[index].current}`}
                    isDragging={isDragging}
                    isSettling={isSettling}
                    loadEager={shouldEagerLoad}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Control
        mediaCount={mediaCount}
        currentMedia={currentMedia}
        setCurrentMedia={setCurrentMedia}
        setIsSettling={setIsSettling}
        setActiveElement={setActiveElement}
        normalizeIndex={normalizeIndex}
        activeElement={activeElement}
      />
    </motion.div>
  );
};

export default Satellite;
