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
import Label from "@/components/Label/Label";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";

import PersonInfo from "@/components/People/PersonInfo";
import MicroFooter from "@/components/Footer/MicroFooter";

import Slideshow from "@/components/Slideshow/Slideshow";

import styles from "./SpotOnPage.module.css";
import { useRef } from "react";

const SpotOnPage = ({ spotOns, spotOn }) => {
  const { deviceDimensions } = useContext(StateContext);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const array = spotOn.author.map((author) => author.name);

  const { scrollY } = useScroll();

  const blurStart = deviceDimensions.height;
  const blurEnd = deviceDimensions.height + 300;

  const opacityStart = 0;
  const opacityEnd = 40;

  const blurValue = useTransform(scrollY, [blurStart, blurEnd], [0, 40]);
  const blurFilter = useMotionTemplate`blur(${blurValue}px)`;

  const opacityValue = useTransform(scrollY, [opacityStart, opacityEnd], [1, 0]);

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
        return <Media showControls={true} medium={side.medium} />;
      case "slideshow":
        return <Slideshow media={side.medium.gallery} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log(spotOn, "medium");
  }, []);

  const CopyrightHover = () => (
    <motion.div className={styles.cover_media_copyright} typo="h5">
      <motion.span
        className={styles.cover_media_copyright_button}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        ©
      </motion.span>
      <motion.div
        className={styles.cover_media_copyright_text}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Text text={translate(spotOn.cover.medium.copyrightInternational)} />
      </motion.div>
    </motion.div>
  );

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
        <motion.h4
          className={styles.author}
          style={{
            opacity: opacityValue,
          }}
        >
          by{" "}
          {spotOn.author.map((author, index) => (
            <motion.span key={index}>{author.name}</motion.span>
          ))}
        </motion.h4>
      </div>
      <div className={styles.cover_media}>
        {renderMedia(spotOn.cover)}
        <CopyrightHover />
        <Label className={styles.label}>ADVERTORIAL</Label>
      </div>

      <div className={styles.author_portait}>
        <ExpandMedia
          medium={spotOn.medium}
          copyright={<Text text={translate(spotOn.medium.copyrightInternational)} />}
        />
      </div>

      {spotOn.showcase[0] && <PersonInfo className={styles.author_info} person={spotOn.showcase[0]} />}
      <InterviewText className={styles.text} text={translate(spotOn.text)} typo={"longcopy"} />
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
