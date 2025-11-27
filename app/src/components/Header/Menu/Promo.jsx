import Link from "next/link";

import { translate } from "@/helpers/translate";

import FadePresence from "@/components/Animation/FadePresence";

import styles from "../Header.module.css";

import Media from "@/components/Media/Media";

import TextCarousel from "@/components/Carousel/TextCarousel";

const Promo = ({ site }) => {
  console.log(site, "site");

  const randomIndex = Math.floor(Math.random() * site.gallery.length);

  return (
    <div className={styles.menu}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
        }}
      >
        <Media className={styles.cover} medium={site.gallery[randomIndex].medium} />
      </div>

      <div className={styles.promo}>
        <TextCarousel text={translate(site.menu_teaser)} />
      </div>
    </div>
  );
};

export default Promo;
