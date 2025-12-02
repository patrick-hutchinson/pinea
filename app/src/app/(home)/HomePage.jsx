"use client";

import { useRef, useEffect } from "react";

import { translate } from "@/helpers/translate";

import { Figure } from "@/components/Figure/Figure";
import ShowcaseFigure from "@/components/Figure/ShowcaseFigure";

import MediaPair from "@/components/MediaPair/MediaPair";

import BlurContainer from "@/components/BlurContainer/BlurContainer";

import Section from "./Section";

import Opening from "./Opening";
import MediaCarousel from "@/components/Carousel/MediaCarousel";
import PortfoliosPreview from "./PortfoliosPreview";

import OpenCallsPreview from "./OpenCallsPreview";
import EventsPreview from "./EventsPreview";
import NewsPreview from "./NewsPreview";

import styles from "./HomePage.module.css";

export default function Home({ pictureBrush, announcements, features, openCalls, news, events, homePage, site }) {
  console.log(site.gallery, "gallery ceovers");

  const containerRef = useRef(null);

  const randomIndex = Math.floor(Math.random() * site.gallery.length);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const containerHeight = containerRef.current.getBoundingClientRect().height;

    setContainerDimensions({ width: containerWidth, height: containerHeight });
  }, []);

  return (
    <main className={styles.main}>
      <Section className={styles.opening}>
        <Opening pictureBrush={pictureBrush} />
      </Section>

      <BlurContainer className={styles.blur_container}>
        <Section>
          <Figure
            size={"full"}
            showControls={true}
            title={features[0].title}
            medium={features[0].cover.medium}
            mediaPairImage={true}
            path={`/stories/reviews/${homePage.feature.reference.slug}`}
          />
        </Section>

        <Section className={styles.portfolio}>
          <h3>PORTFOLIOS</h3>
          <PortfoliosPreview portfolios={homePage.portfolios} />
        </Section>

        <Section>
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

            <ShowcaseFigure
              path="/memberships"
              above={{ title: translate(homePage.member.title), subtitle: translate(homePage.member.description) }}
              medium={site.gallery[randomIndex]?.medium}
              background={"black"}
            />
          </MediaPair>
        </Section>

        <Section>
          <h3>NEWS</h3>
          <NewsPreview news={news} />
        </Section>

        <Section>
          <MediaCarousel announcements={announcements} />
        </Section>

        <Section>
          <h3>OPEN CALLS</h3>
          <OpenCallsPreview openCalls={openCalls} />
        </Section>

        <Section>
          <MediaPair>
            <ShowcaseFigure
              above={{ title: translate(homePage.edition.title), subtitle: translate(homePage.edition.description) }}
              medium={homePage.frame.medium}
            />

            <ShowcaseFigure
              path={`/stories/recommended/${homePage.person.reference.slug.current}`}
              above={{ title: "RECOMMENDED", subtitle: translate(homePage.person.text) }}
              medium={homePage.person?.portrait.medium}
              below={{
                title: <h3 style={{ width: "100%", textAlign: "center" }}>{translate(homePage.person.name)}</h3>,
                subtitle: <h3 style={{ width: "100%", textAlign: "center" }}>{translate(homePage.person.role)}</h3>,
              }}
              background={"transparent"}
            />
          </MediaPair>
        </Section>

        <Section>
          <h3>CALENDAR</h3>

          <EventsPreview events={events} />
        </Section>
      </BlurContainer>
    </main>
  );
}
