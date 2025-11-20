"use client";

import { translate } from "@/helpers/translate";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Media from "@/components/Media/Media";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import InterviewText from "@/components/InterviewText/InterviewText";
import MediaPair from "@/components/MediaPair/MediaPair";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import Text from "@/components/Text/Text";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";

import { useContext } from "react";
import { StateContext } from "@/context/StateContext";

import PersonInfo from "@/components/People/PersonInfo";
import MicroFooter from "@/components/Footer/MicroFooter";

import styles from "./SpotOnPage.module.css";
import { useRef } from "react";

const SpotOnPage = ({ spotOns, spotOn }) => {
  const { deviceDimensions } = useContext(StateContext);
  const ref = useRef(null);
  const array = spotOn.author.map((author) => author.name);

  console.log(deviceDimensions.height, "vp heigth");

  const { scrollY } = useScroll();

  const start = deviceDimensions.height;
  const end = deviceDimensions.height + 300;

  const blurValue = useTransform(scrollY, [start, end], [0, 40]);
  const blurFilter = useMotionTemplate`blur(${blurValue}px)`;

  const opacityValue = useTransform(scrollY, [start, end], [1, 0]);
  const opacityFilter = useMotionTemplate`${opacityValue}`;

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
    <main className={styles.main} ref={ref}>
      <FilterHeader className={styles.filter_header} array={array} />

      <div className={styles.title_container}>
        <motion.h2
          className={styles.title}
          style={{
            filter: blurFilter,
          }}
        >
          <Text text={translate(spotOn.title)} />
        </motion.h2>
        <motion.h4 className={styles.author}>
          by{" "}
          {spotOn.author.map((author, index) => (
            <span
              style={{
                filter: opacityFilter,
              }}
              key={index}
            >
              {author.name}
            </span>
          ))}
        </motion.h4>
      </div>

      <div className={styles.cover_media}>{renderMedia(spotOn.cover)}</div>

      <div className={styles.author_portait}>
        <ExpandMedia
          medium={spotOn.author[0].portrait.medium}
          copyright={<Text text={translate(spotOn.author[0].portrait.medium.copyrightInternational)} />}
        />
      </div>
      {/* <BlurContainer> */}
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
      {/* </BlurContainer> */}

      <MicroFooter />
    </main>
  );
};

export default SpotOnPage;
