"use client";

import { useRouter } from "next/navigation";

import { translate } from "@/helpers/translate";

import Satellite from "@/components/Satellite/Satellite";
import PictureBrush from "@/components/PictureBrush/PictureBrush";
import Feature from "@/components/Feature/Feature";
import Media from "@/components/Media/Media";
import Carousel from "@/components/Carousel/Carousel";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import { Head } from "@/components/Calendar/Head";
import { PlainEvent } from "@/components/Calendar/Event";
import HalfFigure from "@/components/Figures/HalfFigure/HalfFigure";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text/Text";
import FormatDate from "@/components/FormatDate/FormatDate";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import { ShowcaseFigure, FullscreenFigure, FigCaption, MediaContainer } from "@/components/Figure/Figure";
import FrameFeature from "@/components/FrameFeature/FrameFeature";
import Link from "next/link";
import ScrollRevealFigure from "@/components/ScrollRevealFigure/ScrollRevealFigure";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";

import styles from "./HomePage.module.css";
import { useEffect, useState } from "react";
import BlurSpotlightExpand from "@/components/BlurSpotlight/BlurSpotlightExpand";

export default function Home({ pictureBrush, announcements, features, openCalls, news, events, homePage, site }) {
  const router = useRouter();

  const [shuffledOpenCalls, setShuffledOpenCalls] = useState([]);
  const [shuffledNews, setShuffledNews] = useState([]);
  const [shuffledEvents, setShuffledEvents] = useState([]);

  useEffect(() => {
    const now = new Date();

    const hosted = events.filter((event) => event.highlight?.hosted);
    const pinned = events.filter((event) => event.highlight?.pinned);

    const upcoming = events.filter((event) => new Date(event.endDate) >= now);
    const remaining = upcoming.filter((event) => !hosted.includes(event) && !pinned.includes(event));

    const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());

    // Combine and slice to max 5
    setShuffledEvents([...hosted, ...pinned, ...shuffledRemaining].slice(0, 5));
  }, [events]);

  useEffect(() => {
    setShuffledOpenCalls([...openCalls].sort(() => 0.5 - Math.random()).slice(0, 2));
  }, [openCalls]);

  useEffect(() => {
    setShuffledNews([...news].sort(() => 0.5 - Math.random()).slice(0, 2));
  }, [news]);

  // const getShuffledOpenCalls = (openCalls) => [...openCalls].sort(() => 0.5 - Math.random()).slice(0, 2);

  const portfolioImages = homePage.portfolios.map((p) => p.satelliteImage).filter(Boolean);
  const portfolioSlugs = homePage.portfolios.map((p) => p.slug).filter(Boolean);
  const portfolioCaptions = homePage.portfolios.map((p) => p.caption).filter(Boolean);

  useEffect(() => {
    console.log(homePage, "person");
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <PineaIcon />
        <PictureBrush images={pictureBrush.images} />
      </section>

      <div className={`blur_container ${styles.blur_container}`}>
        <section
          className={`${styles.section} ${styles.feature}`}
          onClick={() => router.push(`/stories/reviews/${homePage.feature.reference.slug}`)}
          style={{ cursor: "pointer" }}
        >
          <ScrollRevealFigure item={features[0]} showControls={true} />
          {/* <Feature features={features} /> */}
          {/* <Text className={styles.review_teaser} text={homePage.feature.description} typo="longcopy" /> */}
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <Satellite media={portfolioImages} slugs={portfolioSlugs} captions={portfolioCaptions} />
        </section>

        <section className={`${styles.section}`}>
          <h3>PERIODICAL</h3>

          <MediaPair>
            <HalfFigure
              mediaPairImage={true}
              title={translate(homePage.periodical.title)}
              text={translate(homePage.periodical.description)}
              media={homePage.periodical.gallery}
              onClick={() => router.push(`/stories/visits/${homePage.periodical.reference.slug.current}`)}
              style={{ cursor: "pointer" }}
            />

            <ShowcaseFigure onClick={() => router.push("/members")} style={{ cursor: "pointer" }}>
              <FigCaption>
                <h3>{translate(homePage.member.title)}</h3>
                <Text text={translate(homePage.member.description)} />
              </FigCaption>
              <MediaContainer>
                <ExpandMedia className={styles.showcaseImage} medium={site.gallery[3]?.medium} />
              </MediaContainer>
            </ShowcaseFigure>
          </MediaPair>
        </section>

        <section className={styles.section}>
          <h3>NEWS</h3>
          <Link href="/news">
            <ul className={styles.open_calls_wrapper}>
              {shuffledNews.map((news, index) => {
                return (
                  <HeadlineBlock
                    key={index}
                    openCall={news}
                    title={translate(news.title)}
                    text={translate(news.teaser)}
                    label={<FormatDate date={news.deadline} format={{ month: "short", day: "numeric" }} />}
                  />
                );
              })}
            </ul>
          </Link>
        </section>

        <section className={styles.section}>
          <h3></h3>
          <Carousel announcements={announcements} />
        </section>

        <section className={styles.section}>
          <h3>OPEN CALLS</h3>
          <Link href="/open-calls">
            <ul className={styles.open_calls_wrapper}>
              {shuffledOpenCalls.map((openCall, index) => {
                return (
                  <HeadlineBlock
                    key={index}
                    openCall={openCall}
                    title={translate(openCall.title)}
                    text={translate(openCall.teaser)}
                    label={<FormatDate date={openCall.deadline} format={{ month: "short", day: "numeric" }} />}
                  />
                );
              })}
            </ul>
          </Link>
        </section>

        <section className={styles.section}>
          <MediaPair>
            <ShowcaseFigure>
              <FigCaption>
                <h3>{translate(homePage.edition.title)}</h3>
                <Text text={translate(homePage.edition.description)} />
              </FigCaption>
              <MediaContainer>
                <FrameFeature medium={homePage.edition.medium} />
              </MediaContainer>
            </ShowcaseFigure>

            <div
              style={{ position: "relative", cursor: "pointer" }}
              className={styles.person_preview_container}
              onClick={() => router.push(`/stories/people/${homePage.person.reference.slug.current}`)}
            >
              <BlurSpotlightExpand className={styles.person_preview} medium={homePage.person?.portrait.medium} />
              <FigCaption>
                <h3>{homePage.person?.name}</h3>
                <Text text={translate(homePage.person?.text)} />
              </FigCaption>
            </div>
          </MediaPair>
        </section>

        <section className={styles.section}>
          <h3>CALENDAR</h3>

          <div className={styles.calendar} onClick={() => router.push("/calendar")} style={{ cursor: "pointer" }}>
            <Head />

            <ul typo="h4">
              {shuffledEvents.map((event, index, array) => {
                return <PlainEvent key={index} event={event} array={array} index={index} />;
              })}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
