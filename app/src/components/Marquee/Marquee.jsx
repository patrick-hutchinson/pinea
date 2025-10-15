import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import styles from "./Marquee.module.css";
import Media from "../Media";

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

const Marquee = ({ announcement }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true, dragResistance: 0.1 }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false, // <-- here
      speed: 1,
    }),
  ]);
  const isPlaying = false;

  const toggleAutoplay = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    const playOrStop = autoScroll.isPlaying() ? autoScroll.stop : autoScroll.play;
    playOrStop();
  }, [emblaApi]);

  return (
    <div className={styles.marquee_outer} ref={emblaRef}>
      <div className={styles.marquee_inner}>
        {announcement.map((item, index) => (
          <li key={index} className={styles.slide}>
            {item.type === "advert" && <Advert item={item} />}
            {item.type === "announcement" && <Announcement item={item} />}
            {item.type === "advertorial" && <Advertorial item={item} />}
          </li>
        ))}
      </div>

      <div className="embla__controls">
        <button className="embla__play" onClick={toggleAutoplay} type="button">
          {isPlaying ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default Marquee;
