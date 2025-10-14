"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";

import styles from "./Satellite.module.css";

import { StateContext } from "@/context/StateContext";

import ShrinkMedia from "@/components/ShrinkMedia";

const Satellite = ({ portfolios }) => {
  const { deviceDimensions } = useContext(StateContext);

  const [current, setCurrent] = useState(0);
  const count = portfolios.length;

  const width = deviceDimensions.width;
  const theta = count ? 360 / count : 1;
  const radius = Math.max(100, Math.round((width / 2 / Math.tan(Math.PI / count)) * 2));

  const Control = () => {
    return (
      <ul className={styles.marker_wrapper}>
        {Array.from({ length: count }).map((_, index) => {
          return (
            <li
              key={index}
              className={`${styles.marker} ${index === current ? styles.current : null}`}
              onClick={() => setCurrent(index)}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <div id={styles.container}>
      <div className={styles.wheel_container}>
        <div
          className={styles.wheel}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${-theta * current}deg)`,
            transitionDuration: 1,
            width: `${width}px`,
          }}
        >
          {portfolios.map((portfolio, index) => {
            return (
              <motion.div
                key={index}
                className={styles.media_container}
                style={{
                  transform: `rotateY(${theta * index}deg) translateZ(${radius}px)`,
                  transitionDuration: 1,
                  pointerEvents: index === current ? "all" : "none",
                }}
                transition={{ duration: 1 }}
              >
                <ShrinkMedia item={portfolio} />
              </motion.div>
            );
          })}
        </div>
      </div>

      <Control />
    </div>
  );
};

export default Satellite;
