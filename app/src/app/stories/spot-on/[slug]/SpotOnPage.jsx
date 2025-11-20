"use client";

import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Media from "@/components/Media/Media";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import InterviewText from "@/components/InterviewText/InterviewText";
import MediaPair from "@/components/MediaPair/MediaPair";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import Text from "@/components/Text/Text";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";

import PersonInfo from "@/components/People/PersonInfo";
import MicroFooter from "@/components/Footer/MicroFooter";

import styles from "./SpotOnPage.module.css";

const SpotOnPage = ({ spotOns, spotOn }) => {
  const array = spotOn.author.map((author) => author.name);

  const renderMedia = (block) => {
    if (!block) return null;

    switch (block.type) {
      case "media":
        return <Media medium={block.medium} />;
      case "slideshow":
        return <Slideshow media={block.medium.gallery} />;
      default:
        return null;
    }
  };

  const renderSide = (side) => {
    if (!side) return null;

    switch (side.type) {
      case "media":
        return <Media medium={side.medium} />;
      case "slideshow":
        return <Slideshow media={side.medium.gallery} />;
      default:
        return null;
    }
  };

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filter_header} array={array} />

      <div className={styles.title_container}>
        <h2 className={styles.title}>
          <Text text={translate(spotOn.title)} />
        </h2>
        <h4 className={styles.author}>
          by{" "}
          {spotOn.author.map((author, index) => (
            <span key={index}>{author.name}</span>
          ))}
        </h4>
      </div>

      <div className={styles.cover_media}>{renderMedia(spotOn.cover)}</div>

      <div className={styles.author_portait}>
        <ExpandMedia
          medium={spotOn.author[0].portrait.medium}
          copyright={<Text text={translate(spotOn.author[0].portrait.medium.copyrightInternational)} />}
        />
      </div>
      <BlurContainer>
        <PersonInfo className={styles.author_info} person={spotOn.author[0]} />
        <InterviewText className={styles.text} text={translate(spotOn.text)} typo={"longcopy"} />
        {/* <MediaPair className={`${styles.mediaPair} ${styles.first}`}>
          <div className={styles.longcopy}>
            <InterviewText text={spotOn.text} typo="longcopy" />
          </div>
          <div />
        </MediaPair> */}

        <HeadlineBlock className={styles.quote} title={translate(spotOn.quote)} label="Quote" />

        {spotOn.doubleFeature && (
          <MediaPair className={styles.doubleFeature}>
            <div>{renderSide(spotOn.doubleFeature.left)}</div>
            <div>{renderSide(spotOn.doubleFeature.right)}</div>
          </MediaPair>
        )}
      </BlurContainer>

      <MicroFooter />
    </main>
  );
};

export default SpotOnPage;
