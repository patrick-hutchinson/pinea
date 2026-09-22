"use client";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate/FormatDate";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";
import PersonInfo from "@/components/People/PersonInfo";

import Text from "@/components/Text/Text";
import { useContext, useEffect, useRef } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import Label from "@/components/Label/Label";

import MicroFooter from "@/components/Footer/MicroFooter";

import { translate } from "@/helpers/translate";
import { countFootnotes } from "@/helpers/countFootnotes";

import styles from "./LayoutB.module.css";
import CoverMedia from "@/components/CoverMedia/CoverMedia";
import Longcopy from "@/components/Longcopy/Longcopy";
import ArticleImage from "@/components/ArticleImage/ArticleImage";

const LayoutB = ({ story, stories }) => {
  const { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);
  const visitMediaRef = useRef(null);
  const satelliteRef = useRef(null);
  const safeStory = story || {};
  const safeStories = Array.isArray(stories) ? stories : [];
  const releaseInfo = safeStory?.releaseInfo || {};
  const text = Array.isArray(translate(safeStory.text)) ? translate(safeStory.text) : [];
  const speakers = Array.isArray(safeStory.speakers) ? safeStory.speakers : [];
  const contributors = Array.isArray(releaseInfo.contributor) ? releaseInfo.contributor.filter(Boolean) : [];

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const allFootnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  const secondHalfOffset = countFootnotes(firstHalf, allFootnotes);
  const currentLabel = translate(safeStory.selector);
  const isVisitStory = safeStory.category === "visits";

  const array = safeStories.map((p) => ({
    label: translate(p.selector),
    href: p.slug?.current ? `/stories/${p.category}/${p.slug.current}` : null,
  }));

  const InterviewTitle = () => {
    return (
      <div className={styles.title}>
        <h4>
          <Text text={translate(safeStory.title)} />
        </h4>
        <h2>
          {speakers.map((speaker, index) => {
            return (
              <div className={styles.speaker} key={index}>
                {speaker.name}
              </div>
            );
          })}
        </h2>
        {contributors.map((contributor, index) => {
          return (
            <h4 key={index}>
              {language === "en" ? "by" : "von"} {contributor?.name || ""}, <FormatDate date={releaseInfo.releaseDate} />
            </h4>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (!isVisitStory || !visitMediaRef.current || !satelliteRef.current) return undefined;

    let frame = null;
    const mediaElement = visitMediaRef.current;
    const satelliteElement = satelliteRef.current;

    const updateBlurProgress = () => {
      frame = null;
      const satelliteRect = satelliteElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const blurDistance = viewportHeight * 0.5;
      const progress = Math.min(Math.max((viewportHeight - satelliteRect.top) / blurDistance, 0), 1);

      mediaElement.style.setProperty("--visit-media-blur-progress", progress.toString());
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateBlurProgress);
    };

    updateBlurProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [isVisitStory]);

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filterHeader} array={array} currentlyActive={currentLabel} />

      {safeStory.cover && (
        <div
          ref={isVisitStory ? visitMediaRef : null}
          className={`${styles.cover_media} ${isVisitStory ? styles.visit_media_blur : ""}`}
        >
          <CoverMedia item={safeStory.cover} useCopyrightOverlay={isMobile ? false : true}>
            <Label className={styles.label}>{(safeStory.category || "").replace(/-/g, " ")}</Label>
          </CoverMedia>
        </div>
      )}
      <div className={styles.interview_start}>
        <InterviewTitle />
        {firstHalf.length > 0 && (
          <Longcopy text={firstHalf} allFootnotes={allFootnotes} offset={0} className={styles.longcopy} />
        )}
      </div>

      <div className={styles.blur_container}>
        {Array.isArray(safeStory.gallery) && safeStory.gallery.length > 0 && (
          <div ref={isVisitStory ? satelliteRef : null}>
            <Satellite className={styles.gallery} media={safeStory.gallery} behaviour="expand" />
          </div>
        )}

        {safeStory.fullscreenMedia && <CoverMedia item={safeStory.fullscreenMedia} className={styles.fullscreen_media} />}

        <MediaPair className={`${styles.end} ${styles.mediaPair}`}>
          {safeStory.articleImage && <ArticleImage item={safeStory.articleImage} className={styles.article_image} />}
          <div className={styles.interview_end}>
            {secondHalf.length > 0 && (
              <Longcopy
                text={secondHalf}
                allFootnotes={allFootnotes}
                offset={secondHalfOffset}
                className={styles.longcopy}
              />
            )}
            {allFootnotes.length > 0 && (
              <Footnotes
                text={translate(safeStory.text)}
                allFootnotes={allFootnotes}
                offset={secondHalfOffset}
                className={styles.footnotes}
              />
            )}
          </div>
        </MediaPair>

        {Array.isArray(safeStory.showcase) && safeStory.showcase[0] && (
          <PersonInfo className={styles.author_info} person={safeStory.showcase[0]} />
        )}
        <MicroFooter />
      </div>
    </main>
  );
};

export default LayoutB;
