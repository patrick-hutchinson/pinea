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

const Event = ({ event }) => {
  return event.pinned || event.recommendations ? <HighlightEvent event={event} /> : <PlainEvent event={event} />;
};

export const PlainEvent = ({ event }) => {
  return (
    <Row>
      <Cell>
        <Title event={event} />
      </Cell>

      <EventInfoCell event={event} />
    </Row>
  );
};

const HighlightEvent = ({ event }) => {
  const hasThumbnail = event.thumbnail;
  const hasRecommendation = event.recommendations?.thumbnail;

  const hasMedia = hasRecommendation || hasThumbnail;

  const [showGallery, setShowGallery] = useState(false);

  const displayGallery = event.gallery && showGallery;

  return (
    <div style={{ position: "relative" }}>
      {displayGallery && <Gallery event={event} />}

      <Row
        className={`${hasMedia && styles.hasMedia} ${hasThumbnail && styles.isLarge} ${
          displayGallery && styles.displayGallery
        }`}
      >
        <Cell className={styles.text_cell}>
          <Title event={event} />
          {!showGallery && <EventText event={event} />}
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

      {spotlightMedium && !showGallery && <SpotlightComponent medium={spotlightMedium} />}

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
