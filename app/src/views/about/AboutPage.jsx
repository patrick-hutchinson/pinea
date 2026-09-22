"use client";

import { useEffect, useRef, useState } from "react";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Text from "@/components/Text/Text";
import styles from "./AboutPage.module.css";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import { translate } from "@/helpers/translate";
import MicroFooter from "../../components/Footer/MicroFooter";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

const AboutPage = ({ global, page }) => {
  const scrollPoints = ["mission_statement", "contact"];

  const labels = {
    mission_statement: "Mission Statement",
    contact: "Contact",
  };

  const mission_statement = useRef(null);
  const contact = useRef(null);
  const content = useRef(null);
  const [useSpaciousContactLayout, setUseSpaciousContactLayout] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    setIntroVisible(true);
  }, []);

  useEffect(() => {
    const updateContactLayout = () => {
      if (!mission_statement.current || !content.current) return;

      const rootStyle = window.getComputedStyle(document.documentElement);
      const headerHeight = parseFloat(rootStyle.getPropertyValue("--header-height")) || 0;
      const filterHeight = parseFloat(rootStyle.getPropertyValue("--filter-height")) || 0;
      const contentVh = window.innerHeight - (headerHeight + filterHeight);
      const missionStyle = window.getComputedStyle(mission_statement.current);
      const missionPaddingBottom = parseFloat(missionStyle.paddingBottom) || 0;
      const missionHeightWithoutPadding = mission_statement.current.getBoundingClientRect().height - missionPaddingBottom;

      setUseSpaciousContactLayout(missionHeightWithoutPadding < contentVh / 2);
    };

    updateContactLayout();
    document.fonts?.ready?.then(updateContactLayout);
    window.addEventListener("resize", updateContactLayout);

    return () => {
      window.removeEventListener("resize", updateContactLayout);
    };
  }, []);

  function handleFilter(item) {
    const element = document.getElementById(item);
    if (!element) return;

    const headerOffset = 250; // adjust to match your FilterHeader height
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  const Contact = ({ contact }) => (
    <li>
      <div>{contact.name}</div>
      <div>{translate(contact.role)}</div>
      <div>{contact.phone}</div>
      <a href={`mailto:${contact.email}`} target="_blank" rel="noreferrer">
        {contact.email}
      </a>
    </li>
  );

  return (
    <main className={styles.main}>
      <FilterHeader
        array={scrollPoints.map((id) => labels[id])} // pass labels as display text
        handleFilter={(label) => {
          // find the id by label
          const id = Object.keys(labels).find((key) => labels[key] === label);
          handleFilter(id);
        }}
        className={styles.filter_header}
      />

      <div
        ref={content}
        className={`${styles.content} ${useSpaciousContactLayout ? styles.spaciousContactLayout : ""}`}
      >
        <section
          className={`${styles.missionStatement} ${styles.introFade} ${introVisible ? styles.introFadeVisible : ""}`}
          id="mission_statement"
          ref={mission_statement}
        >
          <Text text={translate(page.about)} typo="h2" />
        </section>

        <ul className={styles.contacts} id="contact" ref={contact} typo="h4">
          {page.contact.map((contact, index) => (
            <Contact key={index} contact={contact} />
          ))}
          <li>
            <Text text={global.address} />
            <a href={`mailto:${page.email}`} target="_blank" rel="noreferrer">
              {global.email}
            </a>
          </li>
        </ul>

        <MicroFooter className={styles.mircoFooter} />
      </div>

      <SitePineaIcon />
    </main>
  );
};

export default AboutPage;
