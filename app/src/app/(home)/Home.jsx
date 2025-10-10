"use client";

import styles from "./Home.module.css";

import PictureBrush from "@/components/PictureBrush/PictureBrush";
import Icon from "@/components/Icon";

import Satellite from "@/components/Satellite/Satellite";

import Feature from "@/components/Feature/Feature";
import Media from "@/components/Media";
import Marquee from "@/components/Marquee/Marquee";
import OpenCall from "@/components/OpenCall";
import Calendar from "@/components/Calendar/Calendar";
import Periodical from "@/components/Periodical/Periodical";
import MediaPair from "@/components/MediaPair/MediaPair";

export default function Home({ pictureBrush, portfolios, features, periodical, announcement, openCalls, events }) {
  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <Icon className={styles.title} path={"icons/pinea_rechteck.svg"} />
        <PictureBrush images={pictureBrush.images} />
      </section>

      <h3>FEATURE</h3>
      <div className={`blur_container ${styles.blur_container}`}>
        <section className={`${styles.section} ${styles.feature}`}>
          <Feature features={features} />
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <Satellite media={portfolios.images} />
        </section>

        <section className={`${styles.section}`}>
          <h3>PERIODICAL</h3>

          <MediaPair>
            <Periodical periodical={periodical} />

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
          </MediaPair>
        </section>

        <section className={styles.section}>
          <h3>OPEN CALLS</h3>
          <ul className={styles.open_calls_wrapper}>
            {openCalls.map((openCall, index) => {
              return <OpenCall key={index} openCall={openCall} />;
            })}
          </ul>
        </section>

        <section className={styles.section}>
          <h3>NEWS</h3>
          <Marquee announcement={announcement} />
        </section>

        <section className={styles.section}>
          <h3>CALENDAR</h3>
          <Calendar events={events} />
        </section>
      </div>
    </main>
  );
}
