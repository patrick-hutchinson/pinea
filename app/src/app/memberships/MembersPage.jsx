"use client";

import { translate } from "@/helpers/translate";
import { useEffect, useRef, useState, useContext } from "react";
import { StateContext } from "@/context/StateContext";
import { CSSContext } from "@/context/CSSContext";

import Text from "@/components/Text/Text";
import MediaPair from "@/components/MediaPair/MediaPair";
import ShowcaseFigure from "@/components/Figure/ShowcaseFigure";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Button from "@/components/Buttons/Button";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import ComponentSlideshow from "@/components/Slideshow/ComponentSlideshow";

import styles from "./MembersPage.module.css";

const MembersPage = ({ memberships, site, siteData }) => {
  const { isMobile, isTablet } = useContext(StateContext);
  const { header_height, filter_height } = useContext(CSSContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(null);

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

  const handleOrderClick = () => {
    window.location.href = "/shop";
  };

  const Wrapper = isTablet || isMobile ? ComponentSlideshow : MediaPair;
  const wrapperProps =
    isTablet || isMobile
      ? { className: styles.componentSlideshow, setCurrentIndex }
      : { className: styles.memberships, id: "join-us" };

  return (
    <main className={styles.main}>
      <FilterHeader array={array} handleFilter={handleFilter} />
      <section className={styles.opening}>
        <SitePineaIcon />
      </section>
      <BlurContainer className={styles.blurContainer}>
        <div
          ref={textRef}
          style={{
            paddingBottom: `max(150px, calc(100vh - ${textHeight}px - var(--header-height-total)))`,
          }}
        >
          <Text typo="h2" className={styles.text} text={translate(site.text)} />
        </div>

        <div>
          <h3 className={styles.headline}>{isMobile ? `MEMBERSHIP ${currentIndex + 1}/2` : "MEMBERSHIPS"}</h3>
          <Wrapper {...wrapperProps}>
            {memberships.map((membership, index) => {
              const above = {
                title: translate(membership.name),
                subtitle: translate(membership.description),
              };

              const below = {
                title: translate(membership.pricing),
                subtitle: (
                <Button className={styles.button} onClick={handleOrderClick}>
                  <div style={{ position: "relative", top: "0.5px" }}>Order</div>
                </Button>
                ),
              };

              return (
                <ShowcaseFigure
                  key={index}
                  className={styles.membership_container}
                  above={above}
                  below={below}
                  medium={siteData.gallery[index].medium}
                  offsetTop={50}
                  expandMedia={false}
                />
              );
            })}
          </Wrapper>
        </div>
      </BlurContainer>
    </main>
  );
};

export default MembersPage;
