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
import { useEffect, useRef, useState, useContext } from "react";
import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";

const MembersPage = ({ memberships, site, siteData }) => {
  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(null);

  const { isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);

  const array = ["Join us"];

  useEffect(() => {
    if (!textRef.current) return;

    setTextHeight(textRef.current.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    console.log(textHeight, "textHeight");
  }, [textHeight]);

  const handleClick = (membership) => {
    const email = "office@pinea-periodical.com";
    const subject = encodeURIComponent(`${membership}`);

    const body = encodeURIComponent(
      `I would like to order the following membership (starting 2026):

Select membership:
(Student: 44 EUR / Austria: 60 EUR / EU: 70 EUR / World: 90 EUR)
First name:
Last name:
Street:
 
—
 
Ich möchte folgende Mitgliedschaft (ab 2026) bestellen:

Mitgliedschaft:
(Student:in: 44 EUR / Österreich: 60 EUR / EU: 70 EUR / Welt: 90 EUR)
Vorname:
Nachname:
Straße:
PLZ:
Stadt:
Land:
Optionaler Kommentar:
`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={array} />
      <section className={styles.opening}>
        <PineaIcon className={styles.pineaIcon} />
      </section>
      <BlurContainer>
        <div
          ref={textRef}
          style={{ marginBottom: isMobile ? "0px" : `${deviceDimensions.height - textHeight - 72 - 50}px` }}
        >
          <Text typo="h2" className={styles.text} text={translate(site.text)} />
        </div>
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
                  <Text text={translate(membership.pricing)} />{" "}
                  <Button className={styles.button} onClick={() => handleClick(translatedName)}>
                    <div style={{ position: "relative", top: "0.5px" }}>Order</div>
                  </Button>
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
