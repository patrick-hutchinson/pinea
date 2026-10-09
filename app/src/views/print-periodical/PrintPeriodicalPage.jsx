"use client";

import { useContext, useMemo } from "react";

import { convertToPlainText } from "@/helpers/convertToPlainText";
import { toShopProductPath } from "@/lib/shopifySlug";
import { getPeriodicalPath } from "@/lib/periodicals/periodicalSlug";
import { LanguageContext } from "@/context/LanguageContext";

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

const translateValue = (value, language = "en") => {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  const translations = value.filter((item) => {
    const entryValue = item?.value;
    if (typeof entryValue === "string") return entryValue.trim().length > 0;
    if (Array.isArray(entryValue)) return entryValue.length > 0;
    return entryValue != null;
  });

  const translation =
    translations.find((item) => item._key === language) ||
    translations.find((item) => item._key === "en") ||
    translations.find((item) => item._key === "de");

  return translation?.value || "";
};

const getChronologicalTimestamp = (periodical, fallbackIndex) => {
  const timestamp = new Date(periodical?._createdAt || "").getTime();
  return Number.isNaN(timestamp) ? fallbackIndex : timestamp;
};

const PeriodicalPage = ({ page, site, periodical, periodicals }) => {
  const { language } = useContext(LanguageContext);
  const safePeriodicals = Array.isArray(periodicals) ? periodicals : [];
  const filterItems = useMemo(
    () =>
      safePeriodicals
        .map((periodical, index) => ({ periodical, index }))
        .sort(
          (a, b) =>
            getChronologicalTimestamp(a.periodical, a.index) - getChronologicalTimestamp(b.periodical, b.index),
        )
        .map(({ periodical, index }) => {
          const translatedSelector = translateValue(periodical?.selector, language);
          return {
            label: translatedSelector || periodical?.title || `Periodical ${index + 1}`,
            href: getPeriodicalPath(periodical, index),
          };
        }),
    [language, safePeriodicals],
  );
  const activePeriodical = periodical || safePeriodicals[0];
  const activeSelector =
    translateValue(activePeriodical?.selector, language) ||
    activePeriodical?.title ||
    filterItems.find((item) => item.href === getPeriodicalPath(activePeriodical, 0))?.label ||
    "";

  const handleOrderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = activePeriodical?.shopifyProductHandle
      ? toShopProductPath(activePeriodical.shopifyProductHandle)
      : "/shop";
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={filterItems} currentlyActive={activeSelector} />

      <Satellite className={styles.satellite} behaviour={"expand"} media={activePeriodical?.gallery || []} />

      <MediaPair className={styles.mediaPair}>
        <ShowcaseFigure
          className={styles.periodicalCoverFigure}
          above={{ title: translateValue(activePeriodical?.isbn, language) }}
          medium={activePeriodical?.cover?.medium}
          below={{
            title: convertToPlainText(translateValue(activePeriodical?.teaser, language)),
            subtitle: (
              <Button className={styles.button} onClick={handleOrderClick}>
                <div style={{ position: "relative", top: "0.5px" }}>Order</div>
              </Button>
            ),
          }}
          background={"black"}
        />

        <div className={`${styles.textFigure} textFigure`} style={{ position: "relative" }}>
          <ComponentSlideshow>
            {activePeriodical?.info?.map((periodicalInfo, index) => {
              const above = { title: convertToPlainText(translateValue(periodicalInfo.title, language)) };
              const content = translateValue(periodicalInfo.text, language);

              return (
                <TextFigure key={`${activePeriodical?._id || "periodical"}-info-${index}`} above={above} content={content} />
              );
            })}
          </ComponentSlideshow>
        </div>
        <div />
      </MediaPair>

      <MediaCarousel className={styles.mediaCarousel} announcements={page.announcements} />

      <SitePineaIcon />
    </main>
  );
};

export default PeriodicalPage;
