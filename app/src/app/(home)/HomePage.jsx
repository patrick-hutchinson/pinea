"use client";

import styles from "./HomePage.module.css";

import PictureBrush from "@/components/PictureBrush/PictureBrush";
import Icon from "@/components/Icon";

import Satellite from "@/components/Satellite/Satellite";

import Feature from "@/components/Feature/Feature";
import Media from "@/components/Media";
import Marquee from "@/components/Marquee/Marquee";
import OpenCall from "@/components/OpenCall";
import { CalendarHead } from "@/components/Calendar/CalendarHead";
import { PlainEvent } from "@/components/Calendar/CalendarEvent";
import Periodical from "@/components/Periodical/Periodical";
import MediaPair from "@/components/MediaPair/MediaPair";

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

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <Icon className={styles.title} path={"icons/pinea_rechteck.svg"} />
        <PictureBrush images={pictureBrush.images} />
      </section>

      <h3 style={{ marginBottom: "36px" }}>FEATURE</h3>
      <div className={`blur_container ${styles.blur_container}`}>
        <section className={`${styles.section} ${styles.feature}`}>
          <Feature features={features} />
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <Satellite portfolios={portfolios} />
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

          <div className={styles.calendar}>
            <CalendarHead />

            <ul className="ff4">
              {getFeaturedEvents(events).map((event, index) => (
                <PlainEvent key={index} event={event} />
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
