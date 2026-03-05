"use client";

import { useRef, useEffect, useContext, useState } from "react";

import { translate } from "@/helpers/translate";

import { Figure } from "@/components/Figure/Figure";

import ShowcaseFigure from "@/components/Figure/ShowcaseFigure";
import MediaPair from "@/components/MediaPair/MediaPair";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Section from "./components/Section";
import Opening from "./components/Opening";
import MediaCarousel from "@/components/Carousel/MediaCarousel";
import PortfoliosPreview from "./components/PortfoliosPreview";

import OpenCallsPreview from "./components/OpenCallsPreview";
import EventsPreview from "./components/EventsPreview";
import NewsPreview from "./components/NewsPreview";

import styles from "./HomePage.module.css";
import { StateContext } from "@/context/StateContext";
import AnimationLink from "@/components/Animation/AnimationLink";

export default function HomePage({ pictureBrush, openCalls, news, events, homePage, site }) {
  const { isMobile } = useContext(StateContext);

  const siteGallery = Array.isArray(site?.gallery) ? site.gallery : [];
  const gallerySeed = siteGallery
    .map((item) => item?.medium?._id || item?._id || "")
    .join("|")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const stableIndex = siteGallery.length > 0 ? gallerySeed % siteGallery.length : -1;
  const visitSlug = homePage?.visit?.reference?.slug;
  const recommendedSlug = homePage?.person?.reference?.slug;

  const [showCookieOnScroll, setShowCookieOnScroll] = useState(true);

  useEffect(() => {
    if (!isMobile) return; // only run on mobile

    const handleScroll = () => {
      const y = window.scrollY;
      setShowCookieOnScroll(y > 50); // visible only if scroll < 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <main className={styles.main}>
      {pictureBrush && (
        <Section className={styles.opening}>
          <Opening pictureBrush={pictureBrush} />
        </Section>
      )}

      <BlurContainer className={styles.blur_container}>
        <Section>
          <Figure
            size={"full"}
            showControls={true}
            title={homePage.featuredArticle.reference.title}
            medium={homePage.featuredArticle.cover.medium}
            path={`/stories/reviews/${homePage.featuredArticle.reference.slug}`}
          />
        </Section>

        <Section className={styles.portfolio}>
          <h3 className={styles.section_heading}>PORTFOLIOS</h3>
          <PortfoliosPreview portfolios={homePage.portfolios} />
        </Section>

        <Section>
          <MediaPair>
            {visitSlug && (
              <Figure
                size={"half"}
                title={homePage.visit.reference.title}
                text={translate(homePage.visit.description)}
                media={homePage.visit.gallery}
                path={`/stories/visits/${visitSlug}`}
                showCrop={false}
                isActive={true}
                zoomOnHover={true}
              />
            )}

            <ShowcaseFigure
                path={`/${homePage.membership.reference.slug.current}`}
                above={{ title: translate(homePage.membership.title), subtitle: translate(homePage.membership.description) }}
                medium={siteGallery[stableIndex]?.medium}
                background={"black"}
              />
          </MediaPair>
        </Section>

        <Section>
          <AnimationLink path="/news">
            <h3 className={styles.section_heading}>NEWS</h3>
          </AnimationLink>
          <NewsPreview news={news} />
        </Section>

        <Section>
          <MediaCarousel announcements={homePage.announcements} />
        </Section>

        <Section>
          <AnimationLink path="/open-calls">
            <h3 className={styles.section_heading}>OPEN CALLS</h3>
          </AnimationLink>
          <OpenCallsPreview openCalls={openCalls} />
        </Section>

        <Section>
          <MediaPair>
            <ShowcaseFigure
              above={{ title: translate(homePage.edition.title), subtitle: translate(homePage.edition.description) }}
              medium={homePage.frame.medium}
            />

            {recommendedSlug && (
              <ShowcaseFigure
                path={`/stories/recommended/${homePage.person?.reference.slug.current}`}
                above={{ title: "RECOMMENDED", subtitle: translate(homePage.person.text) }}
                medium={homePage.person?.reference.portrait.medium}
                below={{
                  title: <h3 style={{ width: "100%", textAlign: "center" }}>{translate(homePage.person.reference.name)}</h3>,
                  subtitle: (
                    <h3 style={{ width: "100%", textAlign: "center" }}>{translate(homePage.person.reference.role)}</h3>
                  ),
                }}
                background={"transparent"}
              />
            )}
          </MediaPair>
        </Section>

        <Section>
          <AnimationLink path="/calendar">
            <h3>CALENDAR</h3>
          </AnimationLink>
          <EventsPreview events={events} />
        </Section>
      </BlurContainer>
    </main>
  );
}
