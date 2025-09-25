"use client";

import { useRef } from "react";

import styles from "./Home.module.css";

import PictureBrush from "@/components/PictureBrush";
import Icon from "@/components/Icon";

import Text from "@/components/Text";
import ScaleOnScroll from "@/components/ScaleOnScroll";
import ImageWheel from "@/components/ImageWheel/ImageWheel";

export default function Home({ pictureBrush, portfolios, features }) {
  const random = Math.floor(Math.random() * features.length);
  const feature = features[random];

  const featureRef = useRef(null);

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <Icon className={styles.title} path={"/pinea.svg"} />
        <PictureBrush className={styles.picture_brush} images={pictureBrush.images} />
      </section>

      <div className={styles.content}>
        <section className={styles.feature} ref={featureRef}>
          <h3>FEATURE</h3>
          <ScaleOnScroll feature={feature} />
          <Text text={feature.description} />
        </section>

        <section>
          <h3>PORTFOLIO</h3>
          <ImageWheel images={portfolios.images} />
        </section>
      </div>
    </main>
  );
}
