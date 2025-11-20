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

import Text from "@/components/Text/Text";

const Satellite = ({ media, className, slugs, captions }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { deviceDimensions } = useContext(StateContext);

  const container = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [current, setCurrent] = useState(0);
  const [base, setBase] = useState(0);
  const [activeElement, setActiveElement] = useState(0);
  const [isSettling, setIsSettling] = useState(false);

  const count = media.length;
  const theta = 360 / count;
  const radius = useRadius(count, deviceDimensions.width);

  const isInView = useInView(container, { margin: "-40% 0px -40% 0px", once: true });

  useEffect(() => {
    if (isInView) {
      setCurrent((prev) => (prev + 1) % count);
    }
  }, [isInView, count]);

  const Control = () => (
    <ul className={styles.controls}>
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className={`${styles.marker} ${index === current ? styles.current : ""}`}
          onClick={() => handleClick(index)}
        />
      ))}
    </ul>
  );

  const handleClick = (index) => {
    setCurrent(index);
  };

  const normalizeIndex = (value, count) => {
    return ((value % count) + count) % count;
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setBase(current);
  };

  const handleDrag = (e, info) => {
    const delta = (info.offset.x / window.innerWidth) * count;
    setCurrent(normalizeIndex(base - delta, count));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsSettling(true); // wheel is now
    setCurrent((prev) => normalizeIndex(Math.round(prev), count));
  };

  const handleTransitionEnd = () => {
    setActiveElement(current);
    console.log("ended transition!");
  };

  const handleNavigate = (index) => {
    if (pathname !== "/") return;

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
            transform: `translateZ(${-radius}px) rotateY(${-theta * current}deg)`,
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
                    // copyright={medium.medium.copyright}
                    copyright={<Text text={translate(medium.medium.copyrightInternational)} />}
                    activeElement={activeElement}
                    hasLanded={!isSettling && index === activeElement}
                  />
                ) : (
                  <ShrinkMedia
                    caption={<Text text={translate(captions[index])} />}
                    medium={medium.medium}
                    hasLanded={!isSettling && index === activeElement}
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
