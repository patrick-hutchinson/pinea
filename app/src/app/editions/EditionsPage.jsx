"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import ShowcaseFigure from "@/components/Figure/ShowcaseFigure";
import ComponentSlideshow from "@/components/Slideshow/ComponentSlideshow";
import TextFigure from "@/components/Figure/TextFigure";
import Button from "@/components/Buttons/Button";
import Text from "@/components/Text/Text";

import styles from "./EditionsPage.module.css";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";

const EditionsPage = ({ editions, site, initialSelector = "" }) => {
  const safeEditions = Array.isArray(editions) ? editions : [];
  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(null);
  const selectorLabels = useMemo(
    () =>
      safeEditions.map((periodical, index) => {
        const translatedSelector = translate(periodical?.selector);
        return translatedSelector || periodical?.title || `Periodical ${index + 1}`;
      }),
    [safeEditions],
  );
  const [activeSelector, setActiveSelector] = useState("");

  useEffect(() => {
    if (!textRef.current) return;
    setTextHeight(textRef.current.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    if (!selectorLabels.length) {
      setActiveSelector("");
      return;
    }

    const initialFromQuery = typeof initialSelector === "string" ? initialSelector : "";
    if (initialFromQuery && selectorLabels.includes(initialFromQuery)) {
      setActiveSelector(initialFromQuery);
      return;
    }

    setActiveSelector((prev) => (prev && selectorLabels.includes(prev) ? prev : selectorLabels[0]));
  }, [selectorLabels, initialSelector]);

  useEffect(() => {
    if (!selectorLabels.length) {
      setActiveSelector("");
      return;
    }

    if (!activeSelector || !selectorLabels.includes(activeSelector)) {
      setActiveSelector(selectorLabels[0]);
    }
  }, [selectorLabels, activeSelector]);

  const activePeriodical =
    safeEditions.find((periodical, index) => {
      const translatedSelector = translate(periodical?.selector) || periodical?.title || `Periodical ${index + 1}`;
      return translatedSelector === activeSelector;
    }) || safeEditions[0];

  return (
    <main className={styles.main}>
      <FilterHeader array={selectorLabels} handleFilter={setActiveSelector} currentlyActive={activeSelector} />

      <BlurContainer className={styles.blurContainer}>
        <div
          ref={textRef}
          style={{
            paddingBottom: `max(150px, calc(100vh - ${textHeight}px - var(--header-height-total)))`,
          }}
        >
          <Text typo="h2" className={styles.text} text={translate(site?.text)} />
        </div>

        <h3 className={styles.headline}>EDITIONS</h3>

        <MediaPair className={styles.mediaPair}>
          <ShowcaseFigure
            above={{ title: translate(activePeriodical?.isbn) }}
            medium={activePeriodical?.cover?.medium}
            below={{
              title: convertToPlainText(translate(activePeriodical?.teaser)),
              subtitle: (
                <Button className={styles.button}>
                  <div style={{ position: "relative", top: "0.5px" }}>Order</div>
                </Button>
              ),
            }}
            background={"black"}
          />

          <div className={`${styles.textFigure} textFigure`} style={{ position: "relative" }}>
            <ComponentSlideshow>
              {activePeriodical?.info?.map((periodicalInfo, index) => {
                const above = { title: convertToPlainText(translate(periodicalInfo.title)) };
                const content = translate(periodicalInfo.text);

                return (
                  <TextFigure
                    key={`${activePeriodical?._id || "periodical"}-info-${index}`}
                    above={above}
                    content={content}
                  />
                );
              })}
            </ComponentSlideshow>
          </div>
        </MediaPair>
      </BlurContainer>
      <SitePineaIcon />
    </main>
  );
};

export default EditionsPage;
