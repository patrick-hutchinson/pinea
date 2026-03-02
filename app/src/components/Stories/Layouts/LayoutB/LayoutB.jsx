"use client";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate/FormatDate";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";
import PersonInfo from "@/components/People/PersonInfo";

import Text from "@/components/Text/Text";
import { useContext, useRef } from "react";
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
  const safeStory = story || {};
  const safeStories = Array.isArray(stories) ? stories : [];
  const text = Array.isArray(translate(safeStory.text)) ? translate(safeStory.text) : [];
  const speakers = Array.isArray(safeStory.speakers) ? safeStory.speakers : [];
  const authors = Array.isArray(safeStory.author) ? safeStory.author : [];

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const allFootnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  const secondHalfOffset = countFootnotes(firstHalf, allFootnotes);

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
        {authors.map((author, index) => {
          return (
            <h4 key={index}>
              {language === "en" ? "by" : "von"} {author.name}, <FormatDate date={safeStory.releaseDate} />
            </h4>
          );
        })}
      </div>
    );
  };

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filterHeader} array={array} />

      {safeStory.cover && (
        <CoverMedia item={safeStory.cover} useCopyrightOverlay={isMobile ? false : true} className={styles.cover_media}>
          <Label className={styles.label}>{(safeStory.category || "").replace(/-/g, " ")}</Label>
        </CoverMedia>
      )}
      <div className={styles.interview_start}>
        <InterviewTitle />
        {firstHalf.length > 0 && <Longcopy text={firstHalf} allFootnotes={allFootnotes} offset={0} className={styles.longcopy} />}
      </div>

      <BlurContainer className={styles.blur_container}>
        {Array.isArray(safeStory.gallery) && safeStory.gallery.length > 0 && (
          <Satellite className={styles.gallery} media={safeStory.gallery} behaviour="expand" />
        )}

        {safeStory.fullscreenMedia && <CoverMedia item={safeStory.fullscreenMedia} className={styles.fullscreen_media} />}

        <MediaPair className={`${styles.end} ${styles.mediaPair}`}>
          {safeStory.articleImage && <ArticleImage item={safeStory.articleImage} className={styles.article_image} />}
          <div className={styles.interview_end}>
            {secondHalf.length > 0 && <Longcopy text={secondHalf} className={styles.longcopy} />}
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
      </BlurContainer>
    </main>
  );
};

export default LayoutB;
