import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import styles from "./Marquee.module.css";
import Media from "../Media";
import "./embla.css";

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
        <h3 className={`ff4 ${styles.title}`}>{item.title}</h3>
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
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {announcement.map((item, index) => (
            <li key={index} className="embla__slide">
              {item.type === "advert" && <Advert item={item} />}
              {item.type === "announcement" && <Announcement item={item} />}
              {item.type === "advertorial" && <Advertorial item={item} />}
            </li>
          ))}
        </div>
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
