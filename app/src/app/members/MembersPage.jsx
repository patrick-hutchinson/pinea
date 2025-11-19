"use client";

import Text from "@/components/Text/Text";
import MediaPair from "@/components/MediaPair/MediaPair";

// import ShowcaseFigure from "@/components/ShowcaseFigure/ShowcaseFigure";
import Media from "@/components/Media/Media";
import { FigCaption, ShowcaseFigure, MediaContainer } from "@/components/Figure/Figure";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Button from "@/components/Button/Button";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { translate } from "@/helpers/translate";

import styles from "./MembersPage.module.css";

const MembersPage = ({ memberships, site, siteData }) => {
  const array = ["Membership", "Join us"];
  const handleClick = (membership) => {
    const email = "office@pinea-periodical.com";
    const subject = encodeURIComponent(`P.IN.E.A ${membership}`);

    const body = encodeURIComponent(
      `I would like to order the following membership (starting 2026):

First name:
Last name:
Address:
Select membership (Student/Austria/EU/World):
Optional comment:

———

Ich möchte folgende Mitgliedschaft (ab 2026) bestellen:

Vorname:
Nachname:
Adresse:
Mitgliedschaft auswählen (Student/Österreich/EU/Welt):
Optionaler Kommentar:
`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={array} />
      <section className={styles.opening}>
        <PineaIcon />
      </section>
      <BlurContainer>
        <Text typo="h2" className={styles.text} text={translate(site.text)} />
        <MediaPair className={styles.memberships}>
          {memberships.map((membership, index) => {
            const translatedName = translate(membership.name);

            return (
              <ShowcaseFigure key={index} className={styles.membership_container}>
                <FigCaption>
                  <h3>{translate(membership.name)}</h3>
                  <Text text={translate(membership.description)} />
                </FigCaption>
                <MediaContainer>
                  <Media className={styles.showcaseImage} medium={siteData.gallery[index].medium} />
                </MediaContainer>
                <FigCaption className={styles.price}>
                  {translate(membership.price)} <Button onClick={() => handleClick(translatedName)}>Order</Button>
                </FigCaption>
              </ShowcaseFigure>
            );
          })}
        </MediaPair>
      </BlurContainer>
    </main>
  );
};

export default MembersPage;
