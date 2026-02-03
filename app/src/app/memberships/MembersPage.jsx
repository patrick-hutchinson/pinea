"use client";

import { translate } from "@/helpers/translate";
import { useEffect, useRef, useState, useContext } from "react";
import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";
import { CSSContext } from "@/context/CSSContext";
import { convertToPlainText } from "@/helpers/convertToPlainText";

import Text from "@/components/Text/Text";
import MediaPair from "@/components/MediaPair/MediaPair";
import ShowcaseFigure from "@/components/Figure/ShowcaseFigure";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Button from "@/components/Buttons/Button";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import ComponentSlideshow from "@/components/Slideshow/ComponentSlideshow";

import styles from "./MembersPage.module.css";

const MembersPage = ({ memberships, site, siteData }) => {
  const { header_height, filter_height } = useContext(CSSContext);

  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(null);

  const { isMobile, isTablet, isDesktop } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);

  const array = ["Join us"];

  useEffect(() => {
    if (!textRef.current) return;

    setTextHeight(textRef.current.getBoundingClientRect().height);
  }, []);

  function handleFilter(item) {
    const normalized = item.replace(/\s+/g, "-").toLowerCase(); // "spot on" → "spot-on"

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
    const email = "office@pinea-periodical.com";
    const subject = encodeURIComponent(`${membershipType}`);
    // function convertToPlainText(blocks = []) {
    //   return blocks
    //     .map((block) => {
    //       if (block._type !== "block" || !block.children) return "";
    //       return block.children.map((child) => child.text).join("");
    //     })
    //     .join("\n\n");
    // }
    const plain = convertToPlainText(membershipData.email);
    const body = encodeURIComponent(plain);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const Wrapper = isMobile ? ComponentSlideshow : MediaPair;
  const wrapperProps = isMobile
    ? { className: styles.componentSlideshow }
    : { className: styles.memberships, id: "join-us" };

  return (
    <main className={styles.main}>
      <FilterHeader array={array} handleFilter={handleFilter} />
      <section className={styles.opening}>
        <PineaIcon className={styles.pineaIcon} />
      </section>
      <BlurContainer>
        <div ref={textRef}>
          <Text typo="h2" className={styles.text} text={translate(site.text)} />
        </div>
        <div></div>
        <Wrapper {...wrapperProps}>
          {memberships.map((membership, index) => {
            const translatedName = translate(membership.name);

            const above = {
              title: !isTablet && !isMobile && translate(membership.name),
              subtitle: translate(membership.description),
            };

            const below = {
              title: convertToPlainText(translate(membership.pricing)),
              subtitle: (
                <Button className={styles.button} onClick={() => handleClick(translatedName, membership)}>
                  <div style={{ position: "relative", top: "0.5px" }}>Order</div>
                </Button>
              ),
            };

            return (
              <div key={index}>
                <ShowcaseFigure
                  key={index}
                  className={styles.membership_container}
                  above={above}
                  below={below}
                  medium={siteData.gallery[index].medium}
                  offsetTop={50}
                  expandMedia={false}
                />
              </div>
            );
          })}
        </Wrapper>
      </BlurContainer>
    </main>
  );
};

export default MembersPage;
