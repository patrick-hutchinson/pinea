"use client";
import { useEffect, useRef } from "react";
import { forwardRef } from "react";

import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";

import BlurSpotlight from "@/components/BlurSpotlight";
import BlurMedia from "@/components/BlurMedia";

import Row from "./Row";
import Cell from "./Cell";

import Title from "./Event/Title";
import Dates from "./Event/Dates";
import Location from "./Event/Location";
import Gallery from "./Event/Gallery";
import Tags from "./Event/Tags";
import EventText from "./Event/EventText";

import styles from "./Calendar.module.css";

import { useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";

const Event = ({ event, index, array }) => {
  // 🔗 Handle Hash Generation
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) {
      router.replace(`#${event._id}`, { scroll: false });
    }
  }, [isInView]);

  // Render Event
  return event.thumbnail ? (
    <ImageEvent event={event} index={index} array={array} ref={ref} />
  ) : event.recommendation ? (
    <RecommendedEvent event={event} index={index} array={array} ref={ref} />
  ) : (
    <PlainEvent event={event} index={index} array={array} ref={ref} />
  );
};

export const PlainEvent = forwardRef(({ event, index, array }, ref) => {
  return (
    <div style={{ position: "relative" }} ref={ref} id={event._id}>
      <Row className={index === array.length - 1 ? styles.last : ""}>
        <Cell>
          <Title event={event} />
        </Cell>

        <Cell>
          <Dates event={event} />
        </Cell>

        <Cell>
          <Location event={event} />
        </Cell>
      </Row>
    </div>
  );
});

const RecommendedEvent = forwardRef(({ event, index, array }, ref) => {
  const isLastRow = index === array.length - 1;

  return (
    <div style={{ position: "relative" }} ref={ref} id={event._id}>
      <Row className={`${styles.hasMedia} ${isLastRow ? styles.last : ""}`}>
        <Cell className={styles.text_cell}>
          <Title event={event} />

          <EventText event={event} />
        </Cell>

        <Cell className={styles.focus}>
          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

          <BlurMedia medium={event.recommendation?.thumbnail} />

          <Tags event={event} />
        </Cell>
      </Row>
    </div>
  );
});

const ImageEvent = forwardRef(({ event, index, array }, ref) => {
  const [showGallery, setShowGallery] = useState(false);
  const displayGallery = event.gallery && showGallery;

  const isLastRow = index === array.length - 1;

  return (
    <div style={{ position: "relative" }} ref={ref} id={event._id}>
      {displayGallery && (
        <FadePresence motionKey="gallery">
          <Gallery event={event} />
        </FadePresence>
      )}

      <Row
        className={`${styles.hasMedia} ${styles.isLarge} ${displayGallery && styles.displayGallery} ${
          isLastRow ? styles.last : ""
        }`}
      >
        <Cell className={styles.text_cell}>
          <Title event={event} />
          {!showGallery && (
            <FadePresence motionKey={event._id}>
              <EventText event={event} />
            </FadePresence>
          )}
        </Cell>

        <Cell className={styles.focus}>
          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

          {!showGallery && (
            <FadePresence motionKey={event._id}>
              <BlurSpotlight caption={event.thumbnail?.copyright} medium={event.thumbnail} />
            </FadePresence>
          )}

          <Tags event={event} setShowGallery={setShowGallery} />
        </Cell>
      </Row>
    </div>
  );
});

export default Event;
