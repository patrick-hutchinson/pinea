import { translate } from "@/helpers/translate";

import styles from "./Menu.module.css";

import Media from "@/components/Media/Media";

import TextCarousel from "@/components/Carousel/TextCarousel";

import Navigation from "./Navigation";

const MenuContent = ({ site }) => {
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

      <Navigation site={site} />

      <div className={styles.promo}>
        <TextCarousel text={translate(site.menu_teaser)} />
      </div>
    </div>
  );
};

export default MenuContent;
