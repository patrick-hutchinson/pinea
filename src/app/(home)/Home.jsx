"use client";

import { useRef, useState, useEffect } from "react";

import styles from "./Home.module.css";

import PictureBrush from "@/components/PictureBrush";
import Icon from "@/components/Icon";

import Text from "@/components/Text";
import ScaleOnScroll from "@/components/ScaleOnScroll";
import ImageWheel from "@/components/ImageWheel/ImageWheel";
import Carousel from "@/components/Carousel";
import Media from "@/components/Media";

export default function Home({ pictureBrush, portfolios, features, periodical, announcement }) {
  const random = Math.floor(Math.random() * features.length);
  const feature = features[random];

  const announcements = useRef(null);
  const announcementsWidth = useState(0);

  // Compute the total width of the slider once
  useEffect(() => {
    if (!announcements.current) return;
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <Icon className={styles.title} path={"/pinea.svg"} />
        <PictureBrush className={styles.picture_brush} images={pictureBrush.images} />
      </section>

      <div className={styles.content}>
        <section className={`${styles.section} ${styles.feature}`}>
          <h3>FEATURE</h3>
          <ScaleOnScroll feature={feature} />
          <div className={styles.description}>
            <Text text={feature.description} />
          </div>
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <ImageWheel images={portfolios.images} />
        </section>

        <section className={`${styles.section} ${styles.periodical}`}>
          <h3>PERIODICAL</h3>
          <div className={styles.periodical_wrapper}>
            <Carousel periodical={periodical} />
            <div className={styles.member_cta}>
              <div className={styles.text_container}>
                <h3>BECOME A MEMBER</h3>
                <p>
                  Premiere issue with articles on Maria Hahnenkamp, Tabita Rezaire, Roger Eberhard, and John Rafman. A
                  look inside the newly renovated Fotomuseum Winterthur. Essay “Hyperreactive” by Annekathrin Kohout.
                  Get to know Fatima Hellberg, new General Director of mumok.
                </p>
              </div>
              <div className={styles.media_container}>
                <Media medium={periodical.cover} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>NEWS</h3>
          <div>
            <ul className={styles.announcement_wrapper} ref={announcements}>
              {announcement.map((item) => {
                return (
                  <li>
                    <div className={`${styles.card} ${item.isAdvert ? styles.advert : styles.announcement}`}>
                      <h3>{item.title}</h3>
                      <Media medium={item.thumbnail} />
                      <h3>{item.topics}</h3>
                    </div>
                    <h4>{item.category}</h4>
                    <h4>{item.subcategory}</h4>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
