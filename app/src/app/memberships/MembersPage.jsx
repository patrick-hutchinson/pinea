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
import { CSSContext } from "@/context/CSSContext";

const MembersPage = ({ memberships, site, siteData }) => {
  const { header_height, filter_height } = useContext(CSSContext);

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

  function handleFilter(item) {
    const normalized = item.replace(/\s+/g, "-").toLowerCase(); // "spot on" → "spot-on"

    console.log(normalized, "normalized");
    const element = document.querySelector(`#${normalized}`);
    if (!element) return;

    const headerOffset = header_height + filter_height; // adjust to match your FilterHeader height
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  const handleClick = (membershipType, membershipData) => {
    console.log(membershipData);
    const email = "office@pinea-periodical.com";
    const subject = encodeURIComponent(`${membershipType}`);

    function portableTextToPlainText(blocks = []) {
      return blocks
        .map((block) => {
          if (block._type !== "block" || !block.children) return "";
          return block.children.map((child) => child.text).join("");
        })
        .join("\n\n");
    }

    const plain = portableTextToPlainText(membershipData.email);
    const body = encodeURIComponent(plain);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={array} handleFilter={handleFilter} />
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
        <div></div>
        <MediaPair className={styles.memberships} id="join-us">
          {memberships.map((membership, index) => {
            const translatedName = translate(membership.name);

            return (
              <ShowcaseFigure key={index} className={styles.membership_container}>
                <FigCaption>
                  <h3>{translate(membership.name)}</h3>
                  <Text text={translate(membership.description)} />
                </FigCaption>
                <MediaContainer className={styles.media_container}>
                  <Media className={styles.showcaseImage} medium={siteData.gallery[index].medium} />
                </MediaContainer>
                <FigCaption className={styles.price}>
                  <Text text={translate(membership.pricing)} />{" "}
                  <Button className={styles.button} onClick={() => handleClick(translatedName, membership)}>
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
