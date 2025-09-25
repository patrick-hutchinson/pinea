"use client";

import { useState, useRef, useEffect, useContext } from "react";

import styles from "./ImageWheel.module.css";

import { StateContext } from "@/context/StateContext";

import Media from "../Media";

const ImageWheel = ({ images }) => {
  const { deviceDimensions } = useContext(StateContext);

  const count = 6;
  const [speed, setSpeed] = useState(1);
  const [current, setCurrent] = useState(0);

  // computed values
  const [theta, setTheta] = useState(0);
  const [radius, setRadius] = useState(0);

  const wheelRef = useRef(null);

  const width = 1000;

  useEffect(() => {
    if (!wheelRef.current) return;

    const t = count ? 360 / count : 1;
    const r = Math.max(100, Math.round(width / 2 / Math.tan(Math.PI / count)));

    setTheta(t);
    setRadius(r);
  }, []);

  const handlePrev = () => setCurrent((c) => c - 1);
  const handleNext = () => setCurrent((c) => c + 1);

  return (
    <div>
      <div className={styles.wheel_container}>
        <div
          className={styles.wheel}
          ref={wheelRef}
          style={{
            transform: `translateZ(${-radius}px) rotateY(${-theta * current}deg)`,
            transitionDuration: `${speed}s`,
            width: `${width}px`,
          }}
        >
          {images.map((image, index) => {
            return (
              <div
                key={index}
                className={styles.media_container}
                style={{
                  opacity: 1,
                  transform: `rotateY(${theta * index}deg) translateZ(${radius}px)`,
                  transitionDuration: `${speed}s`,
                }}
              >
                <Media medium={image} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="controls">
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default ImageWheel;
