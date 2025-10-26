import { useContext, useState } from "react";
import { motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";
import ShrinkMedia from "@/components/ShrinkMedia";
import { useRadius } from "@/hooks/useRadius";
import styles from "./Satellite.module.css";

const Satellite = ({ media, className }) => {
  const { deviceDimensions } = useContext(StateContext);
  const [current, setCurrent] = useState(0);

  const count = media.length;
  const theta = count ? 360 / count : 1;
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

  return (
    <div id={styles.container} className={className}>
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
