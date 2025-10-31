"use client";

import { useRouter } from "next/navigation";

import Satellite from "@/components/Satellite/Satellite";
import PictureBrush from "@/components/PictureBrush/PictureBrush";
import Feature from "@/components/Feature/Feature";
import Media from "@/components/Media/Media";
import Carousel from "@/components/Carousel/Carousel";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import { Head } from "@/components/Calendar/Head";
import { PlainEvent } from "@/components/Calendar/Event";
import Periodical from "@/components/Periodical/Periodical";
import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate";
import PineaIcon from "@/components/PineaIcon/PineaIcon";

import styles from "./HomePage.module.css";

export default function Home({
  pictureBrush,
  portfolios,
  features,
  periodical,
  announcement,
  openCalls,
  events,
  homePage,
}) {
  const router = useRouter();

  console.log(homePage.portfolios, "homePage");

  const getFeaturedEvents = (events) => {
    const now = new Date();

    const hosted = events.filter((event) => event.highlight?.hosted);
    const pinned = events.filter((event) => event.highlight?.pinned);

    const upcoming = events.filter((event) => new Date(event.endDate) >= now);
    const remaining = upcoming.filter((event) => !hosted.includes(event) && !pinned.includes(event));

    const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());

    // Combine and slice to max 5
    return [...hosted, ...pinned, ...shuffledRemaining].slice(0, 5);
  };

  const getShuffledOpenCalls = (openCalls) => [...openCalls].sort(() => 0.5 - Math.random()).slice(0, 2);

  const portfolioImages = homePage.portfolios.map((p) => p.satelliteImage).filter(Boolean);

  console.log(portfolioImages, "pImages");

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <PineaIcon />
        <PictureBrush images={pictureBrush.images} />
      </section>

      {/* <h3 style={{ marginBottom: "36px" }}>FEATURE</h3> */}
      <div className={`blur_container ${styles.blur_container}`}>
        <section className={`${styles.section} ${styles.feature}`}>
          <Feature features={features} />
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <Satellite media={portfolioImages} />
        </section>

        <section className={`${styles.section}`}>
          <h3>PERIODICAL</h3>

          <MediaPair>
            <Periodical periodical={homePage.periodical} />

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
                <Media medium={homePage.periodical.cover} />
              </div>
            </div>
          </MediaPair>
        </section>

        <section className={styles.section}>
          <h3>NEWS</h3>
          <ul className={styles.open_calls_wrapper}>
            {getShuffledOpenCalls(openCalls).map((openCall, index) => {
              return (
                <HeadlineBlock
                  key={index}
                  openCall={openCall}
                  title={openCall.title}
                  text={openCall.description}
                  label={<FormatDate date={openCall.date} format={{ month: "short", day: "numeric" }} />}
                />
              );
            })}
          </ul>
        </section>

        <section className={styles.section}>
          <h3></h3>
          <Carousel announcement={announcement} />
        </section>

        <section className={styles.section}>
          <h3>CALENDAR</h3>

          <div className={styles.calendar} onClick={() => router.push("/calendar")} style={{ cursor: "pointer" }}>
            <Head />

            <ul typo="h4">
              {getFeaturedEvents(events).map((event, index, array) => {
                return <PlainEvent key={index} event={event} array={array} index={index} />;
              })}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
