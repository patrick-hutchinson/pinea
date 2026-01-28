"use client";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Satellite from "@/components/Satellite/Satellite";
import MediaCarousel from "@/components/Carousel/MediaCarousel";

import MediaPair from "@/components/MediaPair/MediaPair";
import ShowcaseFigure from "@/components/Figure/ShowcaseFigure";
import { Figure } from "@/components/Figure/Figure";

import styles from "./PeriodicalPage.module.css";

const PeriodicalPage = ({ page }) => {
  return (
    <main className={styles.main}>
      <FilterHeader array={["COMING SOON"]} />

      <Satellite className={styles.satellite} behaviour={"expand"} media={page.gallery} />

      <MediaPair>
        <ShowcaseFigure
          path="/memberships"
          above={{ title: "ISBN: 0000 0000 00 000 00" }}
          medium={page.gallery[1].medium}
          background={"black"}
        />

        <ShowcaseFigure
          path="/memberships"
          above={{ title: "ISBN: 0000 0000 00 000 00" }}
          medium={page.gallery[1].medium}
          background={"black"}
        />
      </MediaPair>

      <MediaCarousel announcements={page.announcements} />
    </main>
  );
};

export default PeriodicalPage;
