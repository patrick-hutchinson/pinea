"use client";

import { translate } from "@/helpers/translate";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import TitleBlock from "@/components/TitleBlock/TitleBlock";
import Text from "@/components/Text/Text";

import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";
import CoverMedia from "@/components/CoverMedia/CoverMedia";
import Label from "@/components/Label/Label";

import { useContext, useEffect, useState } from "react";
import { DimensionsContext } from "@/context/DimensionsContext";
import { LanguageContext } from "@/context/LanguageContext";
import FormatDate from "@/components/FormatDate/FormatDate";

import PersonInfo from "@/components/People/PersonInfo";
import MicroFooter from "@/components/Footer/MicroFooter";

import styles from "./SpotOnPage.module.css";
import { useRef } from "react";
import DoubleFeature from "@/components/DoubleFeature/DoubleFeature";
import Longcopy from "@/components/Longcopy/Longcopy";

const SpotOnPage = ({ spotOns, spotOn }) => {
  const { deviceDimensions } = useContext(DimensionsContext);
  const { language } = useContext(LanguageContext);

  const ref = useRef(null);
  const array = spotOns.map((item) => translate(item.selector));

  const { scrollY } = useScroll();

  const blurStart = deviceDimensions.height / 2;
  const blurEnd = deviceDimensions.height / (3 / 4);

  const opacityStart = 0;
  const opacityEnd = 40;

  const blurValue = useTransform(scrollY, [blurStart, blurEnd], [0, 40]);
  const blurFilter = useMotionTemplate`blur(${blurValue}px)`;

  const opacityValue = useTransform(scrollY, [opacityStart, opacityEnd], [1, 0]);

  return (
    <main className={styles.main} ref={ref}>
      <FilterHeader className={styles.filter_header} array={array} />
      <div className={styles.title_container}>
        <motion.h2
          className={`${styles.title}`}
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
        {/* {renderMedia(spotOn.cover, false, true)} */}
        <CoverMedia item={spotOn.cover} />
        {/* <CopyrightHover copyright={translate(spotOn.cover.medium.copyrightInternational)} /> */}
      </div>

      <div className={styles.author_portait}>
        <CalendarExpandMedia
          medium={spotOn.medium}
          copyright={<Text text={translate(spotOn.medium.copyrightInternational)} typo="h5" />}
          isActive={true}
        />
      </div>

      <Longcopy text={translate(spotOn.text)} />
      {spotOn.showcase && <PersonInfo className={styles.author_info} person={spotOn.showcase[0]} />}
      <TitleBlock className={styles.quote} title={translate(spotOn.quote)} />
      <p className={styles.quote} title={translate(spotOn.quote)} />
      {spotOn.doubleFeature && <DoubleFeature item={spotOn.doubleFeature} className={styles.double_feature} />}

      <MicroFooter />
    </main>
  );
};

export default SpotOnPage;
