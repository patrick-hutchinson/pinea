"use client";

import { useState, useEffect, useRef } from "react";

import { useScrollToHash } from "@/helpers/scrollToHash";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import FadePresence from "@/components/Animation/FadePresence";
import { useInView } from "framer-motion";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";

import Recommendation from "@/components/People/Recommendation";
import CurrentEvent from "@/components/People/CurrentEvent";
import Text from "@/components/Text/Text";
import PersonInfo from "@/components/People/PersonInfo";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import styles from "./PersonPage.module.css";
import Label from "@/components/Label/Label";

import { translate } from "@/helpers/translate";

const PersonPage = ({ people, person }) => {
  const recommendations = person?.recommendations;

  const [currentEvent, setCurrentEvent] = useState(recommendations && recommendations[0]?.event);
  const currentIndex = recommendations?.findIndex((r) => r.event._id === currentEvent._id);

  const names = people
    .filter((entry) => entry?.name && entry?.slug?.current)
    .map((entry) => ({
      label: entry.name,
      href: `/stories/recommended/${entry.slug.current}`,
    }));

  const infoRef = useRef(null);

  const infoInView = useInView(infoRef, { margin: "-20% 0px -20% 0px" });

  useScrollToHash(-75, []);

  return (
    <main className={styles.main}>
      <FilterHeader array={names} currentlyActive={person?.name} className={styles.filter_header} />

      <MediaPair>
        <div>
          <hr className={styles.divider} />
          <div className={styles.text_column}>
            <ul>
              {person?.recommendations?.map((rec) => (
                <Recommendation key={rec._id} recommendation={rec} setCurrentEvent={setCurrentEvent} />
              ))}
            </ul>
            <br />
            <ExpandMedia
              className={styles.portrait_mobile}
              medium={person?.portrait.medium}
              copyright={<Text text={translate(person?.portrait.medium.copyrightInternational)} />}
            />
            <div ref={infoRef}>
              <PersonInfo className={styles.info_container} person={person} />
            </div>
          </div>
        </div>

        <div className={styles.portrait_desktop}>
          <Label className={styles.label}>RECOMMENDED</Label>
          <Media medium={person?.portrait.medium} showCrop={true} />
          <CopyrightHover copyright={translate(person?.portrait.medium.copyrightInternational)} />
        </div>
      </MediaPair>

      {currentEvent && !infoInView && (
        <FadePresence motionKey={infoInView ? "hide" : "show"}>
          <CurrentEvent event={currentEvent} />
        </FadePresence>
      )}
    </main>
  );
};

export default PersonPage;
