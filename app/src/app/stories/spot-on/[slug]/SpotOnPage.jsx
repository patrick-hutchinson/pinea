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
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";
import Label from "@/components/Label/Label";

import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { LanguageContext } from "@/context/LanguageContext";
import FormatDate from "@/components/FormatDate/FormatDate";

import PersonInfo from "@/components/People/PersonInfo";
import MicroFooter from "@/components/Footer/MicroFooter";

import Slideshow from "@/components/Slideshow/Slideshow";

import styles from "./SpotOnPage.module.css";
import { useRef } from "react";
import DoubleFeature from "@/components/DoubleFeature/DoubleFeature";
import Longcopy from "@/components/Longcopy/Longcopy";

const SpotOnPage = ({ spotOns, spotOn }) => {
  const { deviceDimensions } = useContext(StateContext);
  const { language } = useContext(LanguageContext);

  const ref = useRef(null);
  const array = spotOns.map((item) => translate(item.selector));

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
        return <Media showControls={true} medium={block.medium} showCrop={true} />;
      case "slideshow":
        return <Slideshow media={block.medium.gallery} showCrop={true} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log(spotOn, "medium");
  }, []);

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
          {language === "en" ? "by" : "von"}{" "}
          {spotOn.author.map((author, index) => (
            <span key={index}>{author.name}</span>
          ))}
          ,{" "}
          <FormatDate
            date={spotOn.releaseDate}
            format={{
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }}
          />
        </motion.h4>
      </div>
      <div className={styles.cover_media}>
        <Label className={styles.label}>Spot On</Label>
        {renderMedia(spotOn.cover)}
        <CopyrightHover copyright={translate(spotOn.cover.medium.copyrightInternational)} />
      </div>

      <div className={styles.author_portait}>
        <CalendarExpandMedia
          medium={spotOn.medium}
          copyright={<Text text={translate(spotOn.medium.copyrightInternational)} />}
          isActive={true}
        />
      </div>

      <Longcopy text={translate(spotOn.text)} />
      {spotOn.showcase[0] && <PersonInfo className={styles.author_info} person={spotOn.showcase[0]} />}
      <HeadlineBlock className={styles.quote} title={translate(spotOn.quote)} />
      <p className={styles.quote} title={translate(spotOn.quote)} />
      {spotOn.doubleFeature && <DoubleFeature item={spotOn.doubleFeature} className={styles.double_feature} />}

      <MicroFooter />
    </main>
  );
};

export default SpotOnPage;
