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
  return event.pinned || event.recommendations ? (
    <HighlightEvent event={event} index={index} array={array} />
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

const HighlightEvent = ({ event, index, array }) => {
  const hasThumbnail = event.thumbnail;
  const hasRecommendation = event.recommendations?.thumbnail;

  const hasMedia = hasRecommendation || hasThumbnail;

  const [showGallery, setShowGallery] = useState(false);

  const displayGallery = event.gallery && showGallery;

  return (
    <div style={{ position: "relative" }}>
      {displayGallery && (
        <FadePresence key="gallery">
          <Gallery event={event} />
        </FadePresence>
      )}

      <Row
        className={`${hasMedia && styles.hasMedia} ${hasThumbnail && styles.isLarge} ${
          displayGallery && styles.displayGallery
        } ${index === array.length - 1 ? styles.last : ""}`}
      >
        <Cell className={styles.text_cell}>
          <Title event={event} />
          {!showGallery && (
            <FadePresence key={event._id}>
              <EventText event={event} />
            </FadePresence>
          )}
        </Cell>

        {hasMedia ? (
          <MediaCell event={event} showGallery={showGallery} setShowGallery={setShowGallery} />
        ) : (
          <EventInfoCell event={event} />
        )}
      </Row>
    </div>
  );
};

const MediaCell = ({ event, showGallery, setShowGallery }) => {
  const spotlightMedium = event.thumbnail ?? event.recommendations?.thumbnail;
  const SpotlightComponent = event.thumbnail ? BlurSpotlight : BlurMedia;

  return (
    <Cell className={styles.focus}>
      <div className={styles.eventInfo}>
        <Dates event={event} />

        <Location event={event} />
      </div>

      {spotlightMedium && !showGallery && (
        <FadePresence key={event._id}>
          <SpotlightComponent medium={spotlightMedium} />
        </FadePresence>
      )}

      <Tags event={event} setShowGallery={setShowGallery} />
    </Cell>
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
