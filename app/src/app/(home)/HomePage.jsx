"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { enableScroll, disableScroll } from "@/helpers/blockScrolling";

import { usePathname } from "next/navigation";
import { animate, AnimatePresence } from "framer-motion";
import { translate } from "@/helpers/translate";

import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";
import { useInView } from "framer-motion";

import PineaIcon from "@/components/PineaIcon/PineaIcon";
import PictureBrush from "@/components/PictureBrush/PictureBrush";
import Carousel from "@/components/Carousel/Carousel";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import ShrinkMedia from "@/components/ShrinkMedia/ShrinkMedia";
import FrameFeature from "@/components/FrameFeature/FrameFeature";
import { Figure } from "@/components/Figure/Figure";
import { ShowcaseFigure, FigCaption, MediaContainer } from "@/components/Figure/Figure";

import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text/Text";
import Button from "@/components/Button/Button";

import PortfoliosPreview from "./PortfoliosPreview";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";
import OpenCallsPreview from "./OpenCallsPreview";
import EventsPreview from "./EventsPreview";
import NewsPreview from "./NewsPreview";

import styles from "./HomePage.module.css";
import FadePresence from "@/components/Animation/FadePresence";

export default function Home({ pictureBrush, announcements, features, openCalls, news, events, homePage, site }) {
  const pathname = usePathname();

  const { isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);

  const [hasEntered, setHasEntered] = useState(false);

  const peopleRef = useRef(null);
  const peopleInView = useInView(peopleRef, { once: true, margin: "0px 0px -100px 0px" });

  // Mobile Entry Button
  useEffect(() => {
    if (pathname === "/") {
      setHasEntered(false);
    }
  }, [pathname]);

  // handle scroll lock / unlock
  useEffect(() => {
    if (isMobile === null) return;
    if (isMobile) {
      console.log("is mobile");

      if (hasEntered) {
        console.log("has entered true");
        // Mobile, before pressing ENTER: block scroll
        enableScroll();
      } else {
        console.log("has entered false");
        // Mobile, after pressing ENTER: allow scroll
        disableScroll();
      }
    }

    if (!isMobile) {
      console.log("is desktop");
      // Desktop: treat as already “entered”
      setHasEntered(true);
      enableScroll();
      return;
    }
  }, [isMobile, hasEntered]);

  const handleEnter = () => {
    enableScroll();

    animate(window.scrollY, deviceDimensions.height, {
      duration: 2,
      ease: [0.33, 0, 0.1, 1],
      onUpdate: (y) => window.scrollTo(0, y),
    });

    setHasEntered(true);
  };

  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <PineaIcon />
        <PictureBrush images={pictureBrush.images} />

        {isMobile && !hasEntered && (
          <FadePresence>
            <Button className={styles.enter_button} onClick={() => handleEnter()}>
              ENTER
            </Button>
          </FadePresence>
        )}
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

            <ShowcaseFigure>
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
          <Carousel announcements={announcements} />
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
                <ShrinkMedia
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
