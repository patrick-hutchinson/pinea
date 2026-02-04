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

const PeriodicalPage = ({ page }) => {
  console.log(page, "page");

  return (
    <main className={styles.main}>
      <FilterHeader array={["COMING SOON"]} />

      <Satellite className={styles.satellite} behaviour={"expand"} media={page.gallery} />

      <MediaPair className={styles.mediaPair}>
        <ShowcaseFigure
          path="/memberships"
          above={{ title: `ISBN: ${page.isbn}` }}
          medium={page.gallery[1].medium}
          below={{
            title: convertToPlainText(translate(page.callout)),
            subtitle: (
              <Button className={styles.button} onClick={() => handleClick(translatedName, membership)}>
                <div style={{ position: "relative", top: "0.5px" }}>Buy Soon</div>
              </Button>
            ),
          }}
          background={"black"}
        />

        <div className={styles.textFigure} style={{ position: "relative" }}>
          <ComponentSlideshow>
            {page.periodicalInfo.map((info) => {
              const above = { title: convertToPlainText(translate(info.title)) };
              const content = convertToPlainText(translate(info.text));

              console.log(content, "content");
              return <TextFigure above={above} content={content} />;
            })}
          </ComponentSlideshow>
        </div>
        <div />
      </MediaPair>

      <MediaCarousel className={styles.mediaCarousel} announcements={page.announcements} />
    </main>
  );
};

export default PeriodicalPage;
