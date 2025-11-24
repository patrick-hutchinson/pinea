"use client";

import { useRouter } from "next/navigation";

import { translate } from "@/helpers/translate";

import Satellite from "@/components/Satellite/Satellite";
import PictureBrush from "@/components/PictureBrush/PictureBrush";

import Carousel from "@/components/Carousel/Carousel";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import { Head } from "@/components/Calendar/Head";
import { PlainEvent } from "@/components/Calendar/Event";

import { Figure } from "@/components/Figure/Figure";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text/Text";
import FormatDate from "@/components/FormatDate/FormatDate";
import PineaIcon from "@/components/PineaIcon/PineaIcon";

import { ShowcaseFigure, FigCaption, MediaContainer } from "@/components/Figure/Figure";
import FrameFeature from "@/components/FrameFeature/FrameFeature";
import Link from "next/link";

import BlurContainer from "@/components/BlurContainer/BlurContainer";

import styles from "./HomePage.module.css";
import { useEffect, useState } from "react";
import ExpandShowcase from "@/components/Showcase/ExpandShowcase";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";

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
    const sorted = [...news].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    setShuffledNews(sorted.slice(0, 2));
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

      <BlurContainer className={styles.blur_container}>
        <section className={styles.section}>
          <Figure
            size={"full"}
            showControls={true}
            title={features[0].title}
            // text={translate(homePage.periodical.description)}
            medium={features[0].cover.medium}
            mediaPairImage={true}
            path={`/stories/reviews/${homePage.feature.reference.slug}`}
          />
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIO</h3>
          <Satellite media={portfolioImages} slugs={portfolioSlugs} captions={portfolioCaptions} behaviour="shrink" />
        </section>

        <section className={`${styles.section}`}>
          <MediaPair>
            <Figure
              size={"half"}
              title={homePage.periodical.title}
              text={translate(homePage.periodical.description)}
              media={homePage.periodical.gallery}
              mediaPairImage={true}
              path={`/stories/visits/${homePage.periodical.reference.slug.current}`}
              showCrop={false}
              isActive={true}
            />

            <ShowcaseFigure onClick={() => router.push("/members")} style={{ cursor: "pointer" }}>
              <FigCaption>
                <h3>{translate(homePage.member.title)}</h3>
                <Text text={translate(homePage.member.description)} />
              </FigCaption>
              <MediaContainer>
                <CalendarExpandMedia className={styles.showcaseImage} medium={site.gallery[3]?.medium} />
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
                <FrameFeature medium={homePage.edition.medium} frame={homePage.frame} />
              </MediaContainer>
            </ShowcaseFigure>

            <div
              style={{ position: "relative", cursor: "pointer" }}
              className={styles.person_preview_container}
              onClick={() => router.push(`/stories/people/${homePage.person.reference.slug.current}`)}
            >
              <ExpandShowcase className={styles.person_preview} medium={homePage.person?.portrait.medium} />
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
      </BlurContainer>
    </main>
  );
}
