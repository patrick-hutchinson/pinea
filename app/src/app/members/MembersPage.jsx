"use client";

import Text from "@/components/Text/Text";
import MediaPair from "@/components/MediaPair/MediaPair";

// import ShowcaseFigure from "@/components/ShowcaseFigure/ShowcaseFigure";
import Media from "@/components/Media/Media";
import { FigCaption, ShowcaseFigure, MediaContainer } from "@/components/Figure/Figure";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

import { translate } from "@/helpers/translate";

import styles from "./MembersPage.module.css";

const MembersPage = ({ memberships, site }) => {
  console.log(site.text, "site");
  return (
    <main className={styles.main}>
      <section className={styles.opening}>
        <PineaIcon />
      </section>
      <BlurContainer>
        <Text typo="h2" className={styles.text} text={translate(site.text)} />
        <MediaPair className={styles.memberships}>
          {memberships.map((membership, index) => {
            console.log(membership, "membership");
            return (
              <ShowcaseFigure key={index}>
                <FigCaption>
                  <h3>{translate(membership.name)}</h3>
                  <Text text={translate(membership.description)} />
                </FigCaption>
                <MediaContainer>
                  <Media className={styles.showcaseImage} medium={membership.cover.medium} />
                </MediaContainer>
              </ShowcaseFigure>
            );
          })}
        </MediaPair>
      </BlurContainer>
    </main>
  );
};

export default MembersPage;
