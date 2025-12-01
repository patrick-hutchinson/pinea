"use client";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate/FormatDate";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";

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
import StickyArticleImage from "@/components/ArticleImage/StickyArticleImage";

const LayoutB = ({ story, stories }) => {
  const { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);
  const text = translate(story.text);

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const allFootnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  const secondHalfOffset = countFootnotes(firstHalf, allFootnotes);

  const handleFilter = (filter) => {
    const matchedPortfolio = stories.find((p) => p.selector() === filter.toLowerCase());
    router.push(`${matchedPortfolio.slug.current}`);
  };

  const ref = useRef(null);
  const array = stories.map((p) => ({
    label: translate(p.selector),
    href: p.slug?.current ? `/stories/spot-on/${p.slug.current}` : null,
  }));

  const InterviewTitle = () => {
    return (
      <div className={styles.title}>
        <h4>
          <Text text={translate(story.title)} />
        </h4>
        <h2>
          {story.speakers.map((speaker, index) => {
            return (
              <div className={styles.speaker} key={index}>
                {speaker.name}
              </div>
            );
          })}
        </h2>
        {story.author.map((author, index) => {
          return (
            <h4 key={index}>
              {language === "en" ? "by" : "von"} {author.name}, <FormatDate date={story.releaseDate} />
            </h4>
          );
        })}
      </div>
    );
  };

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filterHeader} array={array} />

      <CoverMedia item={story.cover} useCopyrightOverlay={isMobile ? false : true} className={styles.cover_media}>
        <Label className={styles.label}>VISITS</Label>
      </CoverMedia>
      <div className={styles.interview_start}>
        <InterviewTitle />
        <Longcopy text={firstHalf} allFootnotes={allFootnotes} offset={0} className={styles.longcopy} />
      </div>

      <BlurContainer className={styles.blur_container}>
        {story.gallery && <Satellite className={styles.gallery} media={story.gallery} behaviour="expand" />}

        <CoverMedia item={story.fullscreenMedia} className={styles.fullscreen_media} />

        <MediaPair className={`${styles.end} ${styles.mediaPair}`}>
          {story.articleImage && <StickyArticleImage item={story.articleImage} className={styles.article_image} />}
          <div className={styles.interview_end}>
            <Longcopy text={secondHalf} className={styles.longcopy} />
            <Footnotes
              text={translate(story.text)}
              allFootnotes={allFootnotes}
              offset={secondHalfOffset}
              className={styles.footnotes}
            />
          </div>
        </MediaPair>
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default LayoutB;
