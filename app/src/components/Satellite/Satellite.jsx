import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";
import ShrinkMedia from "@/components/ShrinkMedia";
import { useRadius } from "@/hooks/useRadius";
import styles from "./Satellite.module.css";

const Satellite = ({ media, className }) => {
  const { deviceDimensions } = useContext(StateContext);

  const [isDragging, setIsDragging] = useState(false);
  const [current, setCurrent] = useState(0);
  const [base, setBase] = useState(0); // ← store current before drag

  const count = media.length;
  const theta = 360 / count;
  const radius = useRadius(count, deviceDimensions.width);

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

  const handleDragStart = () => {
    setIsDragging(true);
    setBase(current); // store where we were before dragging
  };

  const handleDrag = (e, info) => {
    const delta = (info.offset.x / window.innerWidth) * count;
    setCurrent(base + delta); // invert if you want opposite direction
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrent(Math.round(current));
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={(e, info) => handleDrag(e, info)}
      onDragEnd={handleDragEnd}
      id={styles.container}
      className={className}
    >
      <div className={styles.wheel_container}>
        <div
          className={styles.wheel}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${theta * current}deg)`,
            transition: isDragging ? "none" : "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
            width: `${deviceDimensions.width}px`,
          }}
        >
          {media.map((portfolio, index) => (
            <motion.div
              key={index}
              className={styles.media_container}
              style={{
                transform: `rotateY(${theta * index}deg) translateZ(${radius}px)`,
                // transitionDuration: "1s",
                pointerEvents: index === current ? "all" : "none",
              }}
              // transition={{ duration: 1 }}
            >
              <ShrinkMedia caption="Artist Name, Title" medium={portfolio.medium} />
            </motion.div>
          ))}
        </div>
      </div>

      <Control />
    </motion.div>
  );
};

export default Satellite;
