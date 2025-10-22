"use client";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";

import styles from "./Satellite.module.css";
import { StateContext } from "@/context/StateContext";
import ShrinkMedia from "@/components/ShrinkMedia";

const Satellite = ({ media }) => {
  const { deviceDimensions } = useContext(StateContext);

  const [current, setCurrent] = useState(0);
  const [radius, setRadius] = useState(100);

  const count = media.length;
  const theta = count ? 360 / count : 1;

  // Radius calculation function
  const calculateRadius = (width) => {
    if (!count) return 100;
    const baseWidth = 1000;
    const baseMultiplier = 1.5;
    const multiplier = baseMultiplier * (width / baseWidth);
    return Math.max(100, (width / 2 / Math.tan(Math.PI / count)) * multiplier);
  };

  // Set initial radius based on deviceDimensions
  useEffect(() => {
    setRadius(calculateRadius(deviceDimensions.width));
  }, [deviceDimensions.width, count]);

  // Debounced resize handler
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setRadius(calculateRadius(window.innerWidth));
      }, 150); // adjust delay as needed
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
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

  return (
    <div id={styles.container}>
      <div className={styles.wheel_container}>
        <div
          className={styles.wheel}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${-theta * current}deg)`,
            transitionDuration: "1s",
            width: `${deviceDimensions.width}px`,
          }}
        >
          {media.map((portfolio, index) => (
            <motion.div
              key={index}
              className={styles.media_container}
              style={{
                transform: `rotateY(${theta * index}deg) translateZ(${radius}px)`,
                transitionDuration: "1s",
                pointerEvents: index === current ? "all" : "none",
              }}
              transition={{ duration: 1 }}
            >
              <ShrinkMedia caption="Artist Name, Title" medium={portfolio.medium} />
            </motion.div>
          ))}
        </div>
      </div>

      <Control />
    </div>
  );
};

export default Satellite;
