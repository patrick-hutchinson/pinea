"use client";

import Text from "@/components/Text/Text";
import MediaPair from "@/components/MediaPair/MediaPair";

// import ShowcaseFigure from "@/components/ShowcaseFigure/ShowcaseFigure";
import Media from "@/components/Media/Media";
import { FigCaption, ShowcaseFigure, MediaContainer } from "@/components/Figure/Figure";

import { translate } from "@/helpers/translate";

import styles from "./MembersPage.module.css";

const MembersPage = ({ memberships, site }) => {
  console.log(site.text, "site");
  return (
    <main className={styles.main}>
      <Text typo="h2" className={styles.text} text={translate(site.text)} />
      <MediaPair>
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
    </main>
  );
};

export default MembersPage;
