"use client";

import { useMemo } from "react";

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
import AnimationLink from "@/components/Animation/AnimationLink";

export default function HomePage({ pictureBrush, openCalls, news, events, homePage, site }) {
  const resolveMedium = (value) => {
    const candidate = value?.medium || value;
    return candidate?.url || candidate?.playbackId ? candidate : null;
  };
  const siteGallery = useMemo(() => (Array.isArray(site?.gallery) ? site.gallery : []), [site?.gallery]);
  const stableIndex = useMemo(() => {
    const gallerySeed = siteGallery
      .map((item) => item?.medium?._id || item?._id || "")
      .join("|")
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

    return siteGallery.length > 0 ? gallerySeed % siteGallery.length : -1;
  }, [siteGallery]);

  const visitSlug = homePage?.visit?.reference?.slug;
  const visitMedia = useMemo(() => {
    const moduleGallery = Array.isArray(homePage?.visit?.gallery) ? homePage.visit.gallery : [];
    if (moduleGallery.length > 0) return moduleGallery;

    const referenceGallery = Array.isArray(homePage?.visit?.reference?.gallery) ? homePage.visit.reference.gallery : [];
    return referenceGallery;
  }, [homePage?.visit]);
  const recommendedSlug = homePage?.person?.reference?.slug;
  const editionProductHandle = homePage?.edition?.shopifyProductHandle;
  const editionPath = editionProductHandle ? `/shop/${editionProductHandle}` : undefined;
  const editionMedium = resolveMedium(homePage?.edition?.medium);
  const featuredArticle = homePage?.featuredArticle;
  const featuredArticleTitle = featuredArticle?.reference?.title;
  const featuredArticleSlug = featuredArticle?.reference?.slug;
  const featuredArticleMedium = resolveMedium(featuredArticle?.cover);
  const membership = homePage?.membership;
  const membershipSlug = membership?.reference?.slug?.current;
  const membershipMedium = resolveMedium(membership?.medium);
  const person = homePage?.person;
  const personReference = person?.reference;
  const personPortraitMedium = resolveMedium(personReference?.portrait);

  return (
    <main className={styles.main}>
      {pictureBrush && (
        <Section className={styles.opening}>
          <Opening pictureBrush={pictureBrush} />
        </Section>
      )}

      <BlurContainer className={styles.blur_container}>
        {(featuredArticleTitle || featuredArticleMedium) && (
        <Section>
          <Figure
            size={"full"}
            showControls={true}
            title={featuredArticleTitle}
            medium={featuredArticleMedium}
            path={featuredArticleSlug ? `/stories/reviews/${featuredArticleSlug}` : undefined}
          />
        </Section>
        )}

        <Section className={styles.portfolio}>
          <h3 className={styles.section_heading}>PORTFOLIOS</h3>
          <PortfoliosPreview portfolios={homePage?.portfolios} />
        </Section>

        <Section>
          <MediaPair>
            {visitSlug && (
              <Figure
                size={"half"}
                title={homePage?.visit?.reference?.title}
                text={translate(homePage?.visit?.description)}
                media={visitMedia}
                path={`/stories/visits/${visitSlug}`}
                showCrop={false}
                isActive={true}
                zoomOnHover={true}
              />
            )}

            {(membership?.title || membership?.description || membershipMedium) && (
              <ShowcaseFigure
                path={membershipSlug ? `/${membershipSlug}` : undefined}
                above={{ title: translate(membership?.title), subtitle: translate(membership?.description) }}
                medium={membershipMedium}
                background={"black"}
              />
            )}
          </MediaPair>
        </Section>

        <Section>
          <AnimationLink path="/news">
            <h3 className={styles.section_heading}>NEWS</h3>
          </AnimationLink>
          <NewsPreview news={news} />
        </Section>

        <Section>
          <MediaCarousel announcements={homePage?.announcements} />
        </Section>

        <Section>
          <AnimationLink path="/open-calls">
            <h3 className={styles.section_heading}>OPEN CALLS</h3>
          </AnimationLink>
          <OpenCallsPreview openCalls={openCalls} />
        </Section>

        <Section>
          <MediaPair>
            {(homePage?.edition?.title || homePage?.edition?.description || editionMedium) && (
              <ShowcaseFigure
                path={editionPath}
                above={{ title: translate(homePage?.edition?.title), subtitle: translate(homePage?.edition?.description) }}
                medium={editionMedium}
              />
            )}

            {recommendedSlug && (
              <ShowcaseFigure
                path={`/stories/recommended/${recommendedSlug.current}`}
                above={{ title: "RECOMMENDED", subtitle: translate(person?.text) }}
                medium={personPortraitMedium}
                below={{
                  title: <h3 style={{ width: "100%", textAlign: "center" }}>{translate(personReference?.name)}</h3>,
                  subtitle: (
                    <h3 style={{ width: "100%", textAlign: "center" }}>{translate(personReference?.role)}</h3>
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
