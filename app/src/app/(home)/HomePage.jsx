"use client";

import { useRef } from "react";

import { useInView } from "framer-motion";

import { translate } from "@/helpers/translate";

import MediaCarousel from "@/components/Carousel/MediaCarousel";

import BlurContainer from "@/components/BlurContainer/BlurContainer";
import ShrinkMedia from "@/components/ShrinkMedia/ShrinkMedia";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import FrameFeature from "@/components/FrameFeature/FrameFeature";
import { Figure } from "@/components/Figure/Figure";
import { ShowcaseFigure, FigCaption, MediaContainer } from "@/components/Figure/Figure";

import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text/Text";

import Opening from "./Opening";
import PortfoliosPreview from "./PortfoliosPreview";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";
import OpenCallsPreview from "./OpenCallsPreview";
import EventsPreview from "./EventsPreview";
import NewsPreview from "./NewsPreview";

import styles from "./HomePage.module.css";

export default function Home({ pictureBrush, announcements, features, openCalls, news, events, homePage, site }) {
  const peopleRef = useRef(null);
  const peopleInView = useInView(peopleRef, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <Opening pictureBrush={pictureBrush} />
      </section>

      <BlurContainer className={styles.blur_container}>
        <section className={styles.section}>
          <Figure
            size={"full"}
            showControls={true}
            title={features[0].title}
            medium={features[0].cover.medium}
            mediaPairImage={true}
            path={`/stories/reviews/${homePage.feature.reference.slug}`}
          />
        </section>

        <section className={`${styles.section} ${styles.portfolio}`}>
          <h3>PORTFOLIOS</h3>
          <PortfoliosPreview portfolios={homePage.portfolios} />
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
              zoomOnHover={true}
            />

            <ShowcaseFigure path="/members">
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
          <NewsPreview news={news} />
        </section>

        <section className={styles.section}>
          <MediaCarousel announcements={announcements} />
        </section>

        <section className={styles.section}>
          <h3>OPEN CALLS</h3>
          <OpenCallsPreview openCalls={openCalls} />
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
              ref={peopleRef}
              style={{ position: "relative", cursor: "pointer" }}
              className={styles.person_preview_container}
            >
              <h3 className={styles.person_preview_title}>RECOMMENDED</h3>

              <div className={styles.people_media_container}>
                <ExpandMedia
                  caption="VERENA KASPAR-EISERT"
                  medium={homePage.person?.portrait.medium}
                  isActive={peopleInView}
                  path={`/stories/people/${homePage.person.reference.slug.current}`}
                />
              </div>
              <Text className={styles.person_preview_text} text={translate(homePage.person.text)} />
            </div>
          </MediaPair>
        </section>

        <section className={styles.section}>
          <h3>CALENDAR</h3>

          <EventsPreview events={events} />
        </section>
      </BlurContainer>
    </main>
  );
}
