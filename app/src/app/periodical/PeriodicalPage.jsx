"use client";

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

import styles from "./PeriodicalPage.module.css";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import PineaIcon from "@/components/PineaIcon/PineaIcon";

const PeriodicalPage = ({ page }) => {
  console.log(page, "page");

  const periodicalTitle = convertToPlainText(translate(page.periodicalInfo[0].title));

  const handleClick = (e, periodicalTitle) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("clicked buy button");
    const email = "office@pinea-periodical.com";
    const subject = encodeURIComponent(`Pre-order request: ${periodicalTitle}`);
    const plain = convertToPlainText(page.email);
    const body = encodeURIComponent(plain);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={["Coming Soon"]} />

      <BlurContainer>
        <Satellite className={styles.satellite} behaviour={"expand"} media={page.gallery} />

        <MediaPair className={styles.mediaPair}>
          <ShowcaseFigure
            path="/memberships"
            above={{ title: `ISBN ${page.isbn}` }}
            medium={page.gallery[1].medium}
            below={{
              title: convertToPlainText(translate(page.callout)),
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
              {page.periodicalInfo.map((periodicalInfo) => {
                const above = { title: convertToPlainText(translate(periodicalInfo.title)) };
                const content = convertToPlainText(translate(periodicalInfo.text));

                console.log(content, "content");
                return <TextFigure above={above} content={content} />;
              })}
            </ComponentSlideshow>
          </div>
          <div />
        </MediaPair>

        <MediaCarousel className={styles.mediaCarousel} announcements={page.announcements} />
      </BlurContainer>
      <PineaIcon className={styles.pineaIcon} />
    </main>
  );
};

export default PeriodicalPage;
