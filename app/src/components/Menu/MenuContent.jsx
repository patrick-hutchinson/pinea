import { translate } from "@/helpers/translate";
import { useMemo } from "react";

import styles from "./Menu.module.css";

import Media from "@/components/Media/Media";

import TextCarousel from "@/components/Carousel/TextCarousel";

import Navigation from "./Navigation";

const MenuContent = ({ site, menu, shopEnabled = false }) => {
  const coverMedium = useMemo(() => {
    const menuMedia = Array.isArray(menu?.mediaAsset) ? menu.mediaAsset.filter(Boolean) : [];

    if (menuMedia.length) {
      return menuMedia[Math.floor(Math.random() * menuMedia.length)];
    }

    const siteGallery = Array.isArray(site?.gallery) ? site.gallery : [];
    const fallbackMedia = siteGallery.map((item) => item?.medium).filter(Boolean);

    return fallbackMedia.length ? fallbackMedia[Math.floor(Math.random() * fallbackMedia.length)] : null;
  }, [menu?.mediaAsset, site?.gallery]);

  return (
    <div className={styles.menu} data-menu-overlay="true">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
        }}
      >
        <div className={styles.cover}>
          {coverMedium ? <Media medium={coverMedium} /> : null}
        </div>
      </div>

      <Navigation site={site} shopEnabled={shopEnabled} />

      <div className={styles.promo}>{menu?.menu_teaser ? <TextCarousel text={translate(menu.menu_teaser)} /> : null}</div>
    </div>
  );
};

export default MenuContent;
