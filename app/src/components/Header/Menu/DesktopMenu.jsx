import Link from "next/link";

import { translate } from "@/helpers/translate";

import FadePresence from "@/components/Animation/FadePresence";

import Text from "@/components/Text/Text";

import styles from "../Header.module.css";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import emblaStyles from "@/components/Carousel/Carousel.module.css";

import Media from "@/components/Media/Media";

const DesktopMenu = ({ site }) => {
  const Carousel = () => {
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
      <div className={`${emblaStyles.carousel_outer} embla`} ref={emblaRef}>
        <div className={`${emblaStyles.carousel_inner} embla__container`}>
          {[...Array(4)].map((_, index) => (
            <li key={index} className={`${emblaStyles.slide} embla__slide`}>
              <Text text={translate(site.menu_teaser)} className={styles.marquee} />
            </li>
          ))}
        </div>
      </div>
    );
  };

  console.log(site, "site");

  const randomIndex = Math.floor(Math.random() * site.gallery.length);

  return (
    <FadePresence className={styles.menu} motionKey="desktop-menu">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "30vw",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* <video className={styles.cover} alt="" autoPlay loop muted playsInline>
          <source src="/images/cover.mp4"></source>
        </video> */}

        <Media className={styles.cover} medium={site.gallery[randomIndex].medium} />
      </div>

      <div className={styles.promo}>
        {/* <TextMarquee text={<Text text={translate(site.menu_teaser)} className={styles.marquee} />} isActive={true} /> */}
        <Carousel />
      </div>
    </FadePresence>
  );
};

export default DesktopMenu;
