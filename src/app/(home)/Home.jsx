"use client";

import { useRef, useState, useEffect } from "react";

import styles from "./Home.module.css";

import PictureBrush from "@/components/PictureBrush/PictureBrush";
import Icon from "@/components/Icon";

import Text from "@/components/Text";
import ZoomImage from "@/components/ZoomImage";
import Satellite from "@/components/Satellite/Satellite";
import Carousel from "@/components/Carousel/Carousel";
import Media from "@/components/Media";
import Marquee from "@/components/Marquee/Marquee";
import OpenCall from "@/components/OpenCall";

export default function Home({ pictureBrush, portfolios, features, periodical, announcement, openCalls }) {
  const random = Math.floor(Math.random() * features.length);
  const feature = features[random];

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <Icon className={styles.title} path={"/pinea.svg"} />
        <PictureBrush images={pictureBrush.images} />
      </section>

      <div className={styles.content}>
        <section className={`${styles.section} ${styles.feature}`}>
          <h3>FEATURE</h3>
          <ZoomImage feature={feature} />
          <div className={styles.description}>
            <Text text={feature.description} />
          </div>
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <Satellite media={portfolios.images} />
        </section>

        <section className={`${styles.section} ${styles.periodical}`}>
          <h3>PERIODICAL</h3>
          <div className={styles.periodical_wrapper}>
            {/* <Carousel images={periodical.images} /> */}
            <div style={{ background: "blue" }}></div>
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
          <h3>OPEN CALLS</h3>
          <ul className="open-calls-wrapper">
            {openCalls.map((openCall, index) => {
              return <OpenCall key={index} openCall={openCall} />;
            })}
          </ul>
        </section>

        <section className={styles.section}>
          <h3>NEWS</h3>

          <Marquee announcement={announcement} />
        </section>
      </div>
    </main>
  );
}
