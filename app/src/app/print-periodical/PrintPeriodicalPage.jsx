"use client";

import { useEffect, useMemo, useState } from "react";

import { convertToPlainText } from "@/helpers/convertToPlainText";
import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Satellite from "@/components/Satellite/Satellite";
import MediaCarousel from "@/components/Carousel/MediaCarousel";
import MediaPair from "@/components/MediaPair/MediaPair";
import ShowcaseFigure from "@/components/Figure/ShowcaseFigure";
import ComponentSlideshow from "@/components/Slideshow/ComponentSlideshow";
import TextFigure from "@/components/Figure/TextFigure";
import Button from "@/components/Buttons/Button";

import styles from "./PrintPeriodicalPage.module.css";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";

const PeriodicalPage = ({ page, site, periodicals }) => {
  const safePeriodicals = Array.isArray(periodicals) ? periodicals : [];
  const selectorLabels = useMemo(
    () =>
      safePeriodicals.map((periodical, index) => {
        const translatedSelector = translate(periodical?.selector);
        return translatedSelector || periodical?.title || `Periodical ${index + 1}`;
      }),
    [safePeriodicals],
  );
  const [activeSelector, setActiveSelector] = useState(selectorLabels[0] || "");

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
    safePeriodicals.find((periodical, index) => {
      const translatedSelector = translate(periodical?.selector) || periodical?.title || `Periodical ${index + 1}`;
      return translatedSelector === activeSelector;
    }) || safePeriodicals[0];

  const periodicalTitle =
    convertToPlainText(translate(activePeriodical?.info?.[0]?.title)) ||
    activePeriodical?.title ||
    "Periodical";

  const handleClick = (e, periodicalTitle) => {
    e.preventDefault();
    e.stopPropagation();
    const email = "office@pinea-periodical.com";
    const subject = encodeURIComponent(`Pre-order request: ${periodicalTitle}`);
    const plain = convertToPlainText(page.email);
    const body = encodeURIComponent(plain);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={selectorLabels} handleFilter={setActiveSelector} currentlyActive={activeSelector} />

      <BlurContainer>
        <Satellite className={styles.satellite} behaviour={"expand"} media={activePeriodical?.gallery || []} />

        <MediaPair className={styles.mediaPair}>
          <ShowcaseFigure
            above={{ title: translate(activePeriodical?.isbn) }}
            medium={activePeriodical?.cover?.medium}
            below={{
              title: convertToPlainText(translate(activePeriodical?.teaser)),
              subtitle: (
                <Button className={styles.button} onClick={(e) => handleClick(e, periodicalTitle)}>
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

                return <TextFigure key={`${activePeriodical?._id || "periodical"}-info-${index}`} above={above} content={content} />;
              })}
            </ComponentSlideshow>
          </div>
          <div />
        </MediaPair>

        <MediaCarousel className={styles.mediaCarousel} announcements={page.announcements} />
      </BlurContainer>
      <SitePineaIcon />
    </main>
  );
};

export default PeriodicalPage;
