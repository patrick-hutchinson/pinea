"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

import { useRouter } from "next/navigation";

import { StateContext } from "@/context/StateContext";
import { usePathname } from "next/navigation";
import { useRadius } from "@/hooks/useRadius";

import ShrinkMedia from "@/components/ShrinkMedia/ShrinkMedia";

import styles from "./Satellite.module.css";
import ExpandMedia from "../ExpandMedia/ExpandMedia";

import { translate } from "@/helpers/translate";

const Satellite = ({ media, className, slugs }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { deviceDimensions } = useContext(StateContext);

  const container = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [current, setCurrent] = useState(0);
  const [base, setBase] = useState(0);
  const [activeElement, setActiveElement] = useState(0);

  const [rotationIndex, setRotationIndex] = useState(0);
  const count = media.length;
  const theta = 360 / count;
  const radius = useRadius(count, deviceDimensions.width);

  const isInView = useInView(container, { margin: "-40% 0px -40% 0px", once: true });

  useEffect(() => {
    if (isInView) {
      setCurrent((prev) => (prev + 1) % count);
    }
  }, [isInView, count]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setRotationIndex((prev) => prev + 1);
        setCurrent((prev) => normalizeIndex(prev + 1, count));
      }

      if (e.key === "ArrowLeft") {
        setRotationIndex((prev) => prev - 1);
        setCurrent((prev) => normalizeIndex(prev - 1, count));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count]);

  const Control = () => (
    <ul className={styles.controls}>
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className={`${styles.marker} ${index === current ? styles.current : ""}`}
          onClick={() => setCurrent(index)}
        />
      ))}
    </ul>
  );

  const normalizeIndex = (value, count) => {
    return ((value % count) + count) % count;
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setBase(current);
  };

  const handleDrag = (e, info) => {
    const delta = (info.offset.x / window.innerWidth) * count;
    setRotationIndex(base - delta);
    setCurrent(normalizeIndex(base - delta, count));
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    setCurrent((prev) => {
      const snapped = Math.round(prev);
      return normalizeIndex(snapped, count);
    });

    setRotationIndex((prev) => Math.round(prev)); // ← NEW
  };
  const handleTransitionEnd = () => {
    setActiveElement(current);
  };

  const handleNavigate = (index) => {
    if (pathname !== "/") return;
    console.log(index);
    if (!slugs) return undefined;

    router.push(`/stories/portfolios/${slugs[index].current}`);
  };

  const expand = pathname !== "/";

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
      onDragEnd={handleDragEnd}
    >
      <div className={styles.wheel_container}>
        <div
          className={styles.wheel}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${-theta * rotationIndex}deg)`,
            transition: isDragging ? "none" : "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)",
            width: `${deviceDimensions.width}px`,
          }}
          onTransitionEnd={() => handleTransitionEnd()}
        >
          {media.map((medium, index) => {
            return (
              <motion.div
                key={index}
                className={styles.media_container}
                id={index}
                style={{
                  transform: `rotateY(${theta * index}deg) translateZ(${radius}px)`,
                  zIndex: index === activeElement ? 10 : 0,
                  pointerEvents: index === activeElement ? "all" : "none",
                }}
                onClick={() => handleNavigate(index)}
              >
                {expand ? (
                  <ExpandMedia
                    medium={medium.medium}
                    copyright={translate(medium.medium.copyrightIntl)}
                    activeElement={activeElement}
                  />
                ) : (
                  <ShrinkMedia
                    caption={translate(medium.medium.subtitle)}
                    medium={medium.medium}
                    isActive={index === activeElement}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Control />
    </motion.div>
  );
};

export default Satellite;
