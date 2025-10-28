import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import styles from "./Carousel.module.css";
import Media from "@/components/Media/Media";

const Advert = ({ item }) => {
  return (
    <div className={styles.advert}>
      <h5 className={styles.type}>{item.type}</h5>
      <div className={styles.card}>
        <Media medium={item.thumbnail} />
      </div>
    </div>
  );
};

const Advertorial = ({ item }) => {
  return (
    <div className={styles.advertorial}>
      <h5 className={styles.type}>{item.type}</h5>
      <div className={styles.card}>
        <Media medium={item.thumbnail} />
      </div>
      <h4 className={styles.title}>{item.title}</h4>
      <h4>{item.category}</h4>
    </div>
  );
};

const Announcement = ({ item }) => {
  return (
    <div className={styles.announcement}>
      <h5 className={styles.type}>{item.type}</h5>
      <div className={styles.card}>
        <h4 className={styles.title}>{item.title}</h4>
        <h3>{item.subtitle}</h3>
      </div>
      <h4>{item.category}</h4>
      <h4>{item.subcategory}</h4>
    </div>
  );
};

const Carousel = ({ announcement }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true, dragResistance: 0.1 }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false, // <-- here
      speed: 1,
    }),
  ]);

  const autoScroll = emblaApi?.plugins()?.autoScroll;

  const handleStop = () => {
    if (!autoScroll) return;
    autoScroll.stop();
  };

  const handleStart = () => {
    if (!autoScroll) return;
    autoScroll.stop();
  };

  return (
    <div
      className={`${styles.carousel_outer} embla`}
      ref={emblaRef}
      onMouseEnter={() => handleStop()}
      onMouseLeave={() => handleStart()}
    >
      <div className={`${styles.carousel_inner} embla__container`}>
        {announcement.map((item, index) => (
          <li key={index} className={`${styles.slide} embla__slide`}>
            {item.type === "advert" && <Advert item={item} />}
            {item.type === "announcement" && <Announcement item={item} />}
            {item.type === "advertorial" && <Advertorial item={item} />}
          </li>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
