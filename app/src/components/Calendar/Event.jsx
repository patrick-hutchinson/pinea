"use client";

import styles from "./Calendar.module.css";

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

import { useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";

const Event = ({ event, index, array }) => {
  return event.thumbnail ? (
    <ImageEvent event={event} index={index} array={array} />
  ) : event.recommendation ? (
    <RecommendedEvent event={event} index={index} array={array} />
  ) : (
    <PlainEvent event={event} index={index} array={array} />
  );
};

export const PlainEvent = ({ event, index, array }) => {
  return (
    <Row className={index === array.length - 1 ? styles.last : ""}>
      <Cell>
        <Title event={event} />
      </Cell>

      <EventInfoCell event={event} />
    </Row>
  );
};

const RecommendedEvent = ({ event, index, array }) => {
  const isLastRow = index === array.length - 1;

  return (
    <div style={{ position: "relative" }}>
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
};

const ImageEvent = ({ event, index, array }) => {
  const [showGallery, setShowGallery] = useState(false);
  const displayGallery = event.gallery && showGallery;

  const isLastRow = index === array.length - 1;

  return (
    <div style={{ position: "relative" }}>
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
};

const EventInfoCell = ({ event }) => (
  <>
    <Cell>
      <Dates event={event} />
    </Cell>
    <Cell>
      <Location event={event} />
    </Cell>
  </>
);

export default Event;
