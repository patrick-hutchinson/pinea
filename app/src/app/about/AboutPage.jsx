"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Text from "@/components/Text/Text";
import Media from "@/components/Media/Media";
import styles from "./AboutPage.module.css";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import { translate } from "@/helpers/translate";
import MicroFooter from "../../components/Footer/MicroFooter";

const AboutPage = ({ global, site }) => {
  const router = useRouter();
  const scrollPoints = ["direction", "people", "contact"];

  const direction = useRef(null);
  const people = useRef(null);
  const contact = useRef(null);

  // Observe sections
  const directionInView = useInView(direction, { margin: "-20% 0px -40% 0px" });
  const peopleInView = useInView(people, { margin: "-20% 0px -40% 0px" });
  const contactInView = useInView(contact, { margin: "-20% 0px -40% 0px" });

  // Update hash when section changes
  useEffect(() => {
    let active = null;
    if (contactInView) active = "contact";
    else if (peopleInView) active = "people";
    else if (directionInView) active = "direction";

    if (active) {
      // Prevent redundant URL updates
      if (window.location.hash !== `#${active}`) {
        router.replace(`#${active}`, { scroll: false });
      }
    }
  }, [directionInView, peopleInView, contactInView, router]);

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
      <FilterHeader array={scrollPoints} handleFilter={handleFilter} className={styles.filter_header} />

      <PineaIcon />

      <div className={styles.blur_container}>
        <section className={styles.text} id="direction" ref={direction}>
          <Text text={translate(site.about)} typo="h2" />
        </section>

        {/* <section id="people" ref={people} className={styles.people}>
          <Media medium={site.portrait.medium} objectFit="contain" />
        </section> */}

        <ul className={styles.contacts} id="contact" ref={contact} typo="h4">
          {site.contact.map((contact, index) => (
            <Contact key={index} contact={contact} />
          ))}
          <li>
            <Text text={global.address} />
            <a href={`mailto:${site.email}`} target="_blank" rel="noreferrer">
              {global.email}
            </a>
          </li>
        </ul>
        {/* <MicroFooter /> */}
      </div>
    </main>
  );
};

export default AboutPage;
