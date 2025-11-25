import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import styles from "./Carousel.module.css";
import Media from "@/components/Media/Media";
import { useRouter } from "next/navigation";

const Advert = ({ item }) => {
  const router = useRouter();
  return (
    <div
      className={styles.advert}
      onClick={() => {
        console.log(item.link, "item link");
        if (!item.link) return;

        if (item.linkType === "internal") {
          router.push(`/stories/spot-on/${item.link}`); // adjust your route pattern
        } else {
          window.open(item.link, "_blank", "noopener,noreferrer");
        }
      }}
    >
      <h5 className={styles.type}>Ad</h5>
      <div className={styles.card}>
        <Media medium={item.media.medium} />
      </div>
    </div>
  );
};

// const Advertorial = ({ item }) => {
//   return (
//     <div className={styles.advertorial}>
//       <h5 className={styles.type}>{item.type}</h5>
//       <div className={styles.card}>
//         <Media medium={item.media.medium} />
//       </div>
//       <h4 className={styles.title}>{item.title}</h4>
//     </div>
//   );
// };

const Announcement = ({ item }) => {
  return (
    <div
      className={styles.announcement}
      onClick={() => {
        item.link && window.open(`${item.link}`, "_blank");
      }}
    >
      <h5 className={styles.type}>{item.type}</h5>
      <div className={styles.card}>
        <h4 className={styles.title}>{item.title}</h4>
        <h3>{item.subtitle}</h3>
      </div>
    </div>
  );
};

const Carousel = ({ announcements }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true, dragResistance: 1 }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false, // <-- here
      stopOnMouseEnter: false, // <— optional: keep scrolling even on hover
      speed: 1,
    }),
  ]);

  // Triple the date in case it is not long enough to fill the width of the screen
  const carouselMedia = [...announcements, ...announcements, ...announcements];

  return (
    <div className={`${styles.carousel_outer} embla`} ref={emblaRef}>
      <div className={`${styles.carousel_inner} embla__container`}>
        {carouselMedia.map((item, index) => (
          <li key={index} className={`${styles.slide} embla__slide`}>
            {item.type === "advert" && <Advert item={item} />}
            {item.type === "announcement" && <Announcement item={item} />}
            {/* {item.type === "advertorial" && <Advertorial item={item} />} */}
          </li>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
