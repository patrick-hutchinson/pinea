import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Text from "@/components/Text/Text";

import styles from "./Carousel.module.css";

const TextCarousel = ({ text, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true, dragResistance: 1 }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false, // <-- here
      stopOnMouseEnter: false, // <— optional: keep scrolling even on hover
      speed: 1,
    }),
  ]);

  // Triple the date in case it is not long enough to fill the width of the screen

  return (
    <div className={`${className} ${styles.carousel_outer} embla`} ref={emblaRef}>
      <div className={`${styles.carousel_inner} embla__container`}>
        {[...Array(4)].map((_, index) => (
          <li key={index} className={`${styles.slide} ${styles.text_slide} embla__slide`}>
            <Text text={text} className={styles.text_marquee} />
          </li>
        ))}
      </div>
    </div>
  );
};

export default TextCarousel;
