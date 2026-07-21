"use client";

import { useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";

import { motion, useInView } from "framer-motion";

import { useRadius } from "@/hooks/useRadius";

import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";

import { translate } from "@/helpers/translate";

import SatelliteShrink from "@/components/ShrinkMedia/SatelliteShrink";
import SatelliteExpand from "../ExpandMedia/SatelliteExpand";
import { buildMediaImageSource } from "@/components/Media/hooks/useImageSource";

import Text from "@/components/Text/Text";
import Control from "./Control";

import styles from "./Satellite.module.css";

const Satellite = ({ media, className, slugs, captions, behaviour }) => {
  const { isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);
  const safeMedia = useMemo(() => (Array.isArray(media) ? media.filter((item) => item?.medium) : []), [media]);
  const safeSlugs = useMemo(() => (Array.isArray(slugs) ? slugs : []), [slugs]);
  const safeCaptions = useMemo(() => (Array.isArray(captions) ? captions : []), [captions]);

  const inertiaRef = useRef(null);
  const decodedImagesRef = useRef(new Set());
  const decodingImagesRef = useRef(new Map());
  const activeImageSourceRef = useRef(null);

  const container = useRef(null);

  const [isHolding, setIsHolding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const [currentMedia, setCurrentMedia] = useState(0);

  const [base, setBase] = useState(0);
  const [activeElement, setActiveElement] = useState(0);

  const mediaCount = safeMedia.length;
  const theta = 360 / mediaCount;
  const radius = useRadius(mediaCount, deviceDimensions.width);

  const isInView = useInView(container, { margin: "-40% 0px -40% 0px", once: false });

  const imageSources = useMemo(() => {
    const sources = safeMedia
      .map((item) => item?.medium)
      .filter((item) => item?.type === "image" && item?.url)
      .map((item) => buildMediaImageSource(item, null, false, isMobile, deviceDimensions.width))
      .filter(Boolean);

    return [...new Set(sources)];
  }, [safeMedia, isMobile, deviceDimensions.width]);

  const preloadImage = useCallback((src) => {
    if (!src || typeof window === "undefined") return Promise.resolve();
    if (decodedImagesRef.current.has(src)) return Promise.resolve();
    if (decodingImagesRef.current.has(src)) return decodingImagesRef.current.get(src);

    const promise = new Promise((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        const decodePromise = image.decode?.();

        if (decodePromise?.then) {
          decodePromise
            .catch(() => {})
            .finally(() => {
              decodedImagesRef.current.add(src);
              resolve();
            });
          return;
        }

        decodedImagesRef.current.add(src);
        resolve();
      };
      image.onerror = () => resolve();
      image.src = src;
    }).finally(() => {
      decodingImagesRef.current.delete(src);
    });

    decodingImagesRef.current.set(src, promise);
    return promise;
  }, []);

  useEffect(() => {
    imageSources.forEach((src) => preloadImage(src));
  }, [imageSources, preloadImage]);

  useEffect(() => {
    const activeMedium = safeMedia[activeElement]?.medium;
    activeImageSourceRef.current =
      activeMedium?.type === "image"
        ? buildMediaImageSource(activeMedium, null, false, isMobile, deviceDimensions.width)
        : null;
  }, [activeElement, safeMedia, isMobile, deviceDimensions.width]);

  useEffect(() => {
    if (mediaCount === 0) return;
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

  const normalizeIndex = (value, mediaCount) => {
    return ((value % mediaCount) + mediaCount) % mediaCount;
  };

  if (mediaCount === 0) return null;

  const handleDragStart = () => {
    setIsSettling(true);
    setIsDragging(true);

    setBase(currentMedia);
    setActiveElement(currentMedia);
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
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

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

  // Detect the end of the wheel animation
  useEffect(() => {
    const wheelEl = container.current?.querySelector(`.${styles.wheel}`);
    if (!wheelEl) return;

    const handleWheelTransitionEnd = (e) => {
      if (e.propertyName === "transform") {
        preloadImage(activeImageSourceRef.current).finally(() => setIsSettling(false));
      }
    };

    wheelEl.addEventListener("transitionend", handleWheelTransitionEnd);

    return () => wheelEl.removeEventListener("transitionend", handleWheelTransitionEnd);
  }, [preloadImage]);

  return (
    <motion.div
      id={styles.container}
      className={className}
      ref={container}
      data-satellite
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
          {safeMedia.map((medium, index) => {
            const currentMedium = medium?.medium;
            if (!currentMedium) return null;

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
                    medium={currentMedium}
                    copyright={<Text text={translate(currentMedium?.copyrightInternational)} />}
                    activeElement={activeElement}
                    hasLanded={isInView && !isSettling && index === activeElement}
                    loadEager={true}
                  />
                ) : (
                  <SatelliteShrink
                    caption={<Text text={translate(safeCaptions[index])} typo="h4" />}
                    medium={currentMedium}
                    hasLanded={!isSettling && index === activeElement}
                    path={safeSlugs[index]?.current ? `/stories/portfolios/${safeSlugs[index].current}` : undefined}
                    isDragging={isDragging}
                    isSettling={isSettling}
                    loadEager={true}
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
