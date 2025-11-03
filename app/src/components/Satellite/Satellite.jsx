import { useContext, useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

import { StateContext } from "@/context/StateContext";

import { useRadius } from "@/hooks/useRadius";

import ShrinkMedia from "@/components/ShrinkMedia";

import styles from "./Satellite.module.css";

const Satellite = ({ media, className }) => {
  const { deviceDimensions } = useContext(StateContext);

  const container = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [current, setCurrent] = useState(0);
  const [base, setBase] = useState(0);
  const [activeElement, setActiveElement] = useState(0);

  const count = media.length;
  const theta = 360 / count;
  const radius = useRadius(count, deviceDimensions.width);

  const isInView = useInView(container, { margin: "-40% 0px -40% 0px", once: true });

  useEffect(() => {
    if (isInView) {
      setCurrent((prev) => (prev - 1) % count);
    }
  }, [isInView, count]);

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
    setCurrent(normalizeIndex(base - delta, count));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrent((prev) => normalizeIndex(Math.round(prev), count));
  };

  const handleTransitionEnd = () => {
    setActiveElement(current);
  };

  useEffect(() => {
    console.log(activeElement, "active Element");
  }, [activeElement]);

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
          {media.map((portfolio, index) => {
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
              >
                <ShrinkMedia
                  caption={portfolio.medium.subtitle}
                  medium={portfolio.medium}
                  isActive={index === activeElement}
                />
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
