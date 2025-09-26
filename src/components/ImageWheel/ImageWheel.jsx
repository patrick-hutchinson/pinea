"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";

import styles from "./ImageWheel.module.css";

import { StateContext } from "@/context/StateContext";

import Media from "../Media";

const ImageWheel = ({ images }) => {
  const { deviceDimensions } = useContext(StateContext);

  const [current, setCurrent] = useState(0);
  const count = 6;

  const width = deviceDimensions.width;
  const theta = count ? 360 / count : 1;
  const radius = Math.max(100, Math.round(width / 2 / Math.tan(Math.PI / count)));

  return (
    <div id={styles.wrapper}>
      <div className={styles.wheel_container}>
        <div
          className={styles.wheel}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${-theta * current}deg)`,
            transitionDuration: 1,
            width: `${width}px`,
          }}
        >
          {images.map((image, index) => {
            return (
              <div
                key={index}
                className={styles.media_container}
                style={{
                  transform: `rotateY(${theta * index}deg) translateZ(${radius}px)`,
                  transitionDuration: 1,
                }}
              >
                <Media medium={image} />
              </div>
            );
          })}
        </div>
      </div>

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
    </div>
  );
};

export default ImageWheel;
