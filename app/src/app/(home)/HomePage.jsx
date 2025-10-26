"use client";

import styles from "./HomePage.module.css";

import PictureBrush from "@/components/PictureBrush/PictureBrush";

import Satellite from "@/components/Satellite/Satellite";

import Feature from "@/components/Feature/Feature";
import Media from "@/components/Media/Media";
import Carousel from "@/components/Carousel/Carousel";
import OpenCall from "@/components/OpenCall/OpenCall";
import { Head } from "@/components/Calendar/Head";
import { PlainEvent } from "@/components/Calendar/Event";
import Periodical from "@/components/Periodical/Periodical";
import MediaPair from "@/components/MediaPair/MediaPair";

import PineaIcon from "@/components/PineaIcon/PineaIcon";

import Link from "next/link";

export default function Home({ pictureBrush, portfolios, features, periodical, announcement, openCalls, events }) {
  const getFeaturedEvents = (events) => {
    const now = new Date();

    const ongoing = events
      .filter((e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    const upcoming = events
      .filter((e) => new Date(e.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const past = events
      .filter((e) => new Date(e.endDate) < now)
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    // Combine and take only 5
    return [...ongoing, ...upcoming, ...past].slice(0, 5);
  };

  const portfolio = portfolios[0];

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <PineaIcon />
        <PictureBrush images={pictureBrush.images} />
      </section>

      <h3 style={{ marginBottom: "36px" }}>FEATURE</h3>
      <div className={`blur_container ${styles.blur_container}`}>
        <section className={`${styles.section} ${styles.feature}`}>
          <Feature features={features} />
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <Satellite media={portfolio.gallery} />
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
              return <OpenCall key={index} openCall={openCall} title={openCall.title} text={openCall.description} />;
            })}
          </ul>
        </section>

        <section className={styles.section}>
          <h3>NEWS</h3>
          <Carousel announcement={announcement} />
        </section>

        <section className={styles.section}>
          <h3>CALENDAR</h3>

          <Link href="/calendar">
            <div className={styles.calendar}>
              <Head />

              <ul typo="h4">
                {getFeaturedEvents(events).map((event, index, array) => {
                  return <PlainEvent key={index} event={event} array={array} index={index} />;
                })}
              </ul>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
