import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import styles from "./Carousel.module.css";
import Media from "@/components/Media/Media";

import { motion } from "framer-motion";

import Link from "next/link";

const Advert = ({ item }) => {
  const Wrapper = item.link ? Link : "div";

  const wrapperProps = item.link
    ? {
        href: item.linkType === "internal" ? `/stories/spot-on/${item.link}` : item.link,
        ...(item.linkType === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      }
    : {};
  return (
    <Wrapper className={styles.advert} {...wrapperProps}>
      <h5 className={styles.type}>Ad</h5>
      <div className={styles.card}>
        <Media medium={item.media.medium} />
      </div>
    </Wrapper>
  );
};

const Announcement = ({ item }) => {
  const Wrapper = item.link ? Link : "div";

  const wrapperProps = item.link
    ? {
        href: item.linkType === "internal" ? `/stories/spot-on/${item.link}` : item.link,
        ...(item.linkType === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      }
    : {};

  return (
    <Wrapper className={styles.announcement} {...wrapperProps}>
      <h5 className={styles.type}>{item.type}</h5>
      <div className={styles.card}>
        <h4 className={styles.title}>{item.title}</h4>
        <h3>{item.subtitle}</h3>
      </div>
    </Wrapper>
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
    <motion.div className={`${styles.carousel_outer} embla`} ref={emblaRef}>
      <div className={`${styles.carousel_inner} embla__container`}>
        {carouselMedia.map((item, index) => (
          <li key={index} className={`${styles.slide} embla__slide`}>
            {item.type === "advert" && <Advert item={item} />}
            {item.type === "announcement" && <Announcement item={item} />}
            {/* {item.type === "advertorial" && <Advertorial item={item} />} */}
          </li>
        ))}
      </div>
    </motion.div>
  );
};

export default Carousel;
