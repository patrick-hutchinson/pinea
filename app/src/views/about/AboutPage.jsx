"use client";

import { useRef } from "react";

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

      <div className={styles.content}>
        <section className={styles.missionStatement} id="mission_statement" ref={mission_statement}>
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
