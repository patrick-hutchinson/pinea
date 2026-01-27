"use client";
import { useEffect, useRef } from "react";
import { forwardRef } from "react";

import { useInView } from "framer-motion";

import EventRecommendationText from "./Event/EventText/EventRecommendationText";
import EventDescription from "./Event/EventText/EventDescription";
import { useContext } from "react";

import { CSSContext } from "@/context/CSSContext";

import CalendarShowcase from "@/components/Showcase/CalendarShowcase";

import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

import Row from "./Row";
import Cell from "./Cell";

import Title from "./Event/Title";
import Dates from "./Event/Dates";
import Location from "./Event/Location";
import Gallery from "./Event/Gallery";
import Tags from "./Event/Tags";

import ShareEvent from "./Event/ShareEvent";

import styles from "./Calendar.module.css";

import { useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";
import { StateContext } from "@/context/StateContext";

const Event = ({ event, setCurrentlyInView }) => {
  const { header_height, filter_height } = useContext(CSSContext);

  // 🔗 Handle Hash Generation
  const ref = useRef(null);

  const isInView = useInView(ref, {
    margin: `${header_height + filter_height + 50}px 0px -85% 0px`,
  });

  useEffect(() => {
    if (isInView) {
      setCurrentlyInView(event);
    }
  }, [isInView]);

  // Check if the event is in the past

  const hasThumbnail = event.thumbnail && event.thumbnail.mediaType !== "none";
  // Render Event
  return event.recommendation ? (
    <RecommendedEvent event={event} ref={ref} />
  ) : event.highlight?.pinned ? (
    <PinnedEvent event={event} ref={ref} />
  ) : hasThumbnail ? (
    <ImageEvent event={event} ref={ref} />
  ) : (
    <PlainEvent event={event} ref={ref} showShare={true} />
  );
};

export const PlainEvent = forwardRef(({ event, showShare, className }, ref) => {
  const { isMobile } = useContext(StateContext);
  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      id={event._id}
      className={`${styles.plainEvent} ${styles.event} ${className}`}
    >
      <Row>
        <Cell>
          <Title event={event} />
          {isMobile && showShare && <ShareEvent event={event} url={`/calendar#${event._id}`} />}
        </Cell>

        {!isMobile ? (
          <>
            <Cell>
              <Dates event={event} />
            </Cell>

            <Cell>
              <Location event={event} />
            </Cell>
          </>
        ) : (
          <Cell>
            <Dates event={event} />

            <Location event={event} />
          </Cell>
        )}
      </Row>
    </div>
  );
});

const RecommendedEvent = forwardRef(({ event }, ref) => {
  const { isMobile } = useContext(StateContext);

  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      id={event._id}
      className={`${styles.event} ${styles.recommendedEvent} ${event.thumbnail && styles.hasImage}`}
    >
      <Row>
        <Cell className={styles.textCell}>
          <Title event={event} />

          <div>
            <EventRecommendationText event={event} />
            {isMobile && <ShareEvent event={event} url={`/calendar#${event._id}`} />}
          </div>
        </Cell>

        <Cell className={styles.focus}>
          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

          {event.thumbnail && (
            <CalendarShowcase
              className={styles.blur_spotlight}
              caption={<Text text={translate(event.thumbnail?.copyrightInternational)} />}
              medium={event.thumbnail}
            />
          )}

          <Tags event={event} />
        </Cell>
      </Row>
    </div>
  );
});

const ImageEvent = forwardRef(({ event }, ref) => {
  const [showGallery, setShowGallery] = useState(false);
  const displayGallery = event.gallery && showGallery;

  const { isMobile } = useContext(StateContext);

  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      id={event._id}
      className={`${styles.hasImage} ${styles.event} ${showGallery && styles.galleryIsVisible}`}
    >
      {displayGallery && (
        <FadePresence motionKey="gallery">
          <Gallery event={event} />
        </FadePresence>
      )}

      <Row>
        <Cell className={styles.textCell}>
          <Title event={event} />
          <div>
            {!showGallery && (
              <FadePresence motionKey={event._id}>
                <EventDescription event={event} />
              </FadePresence>
            )}
            {isMobile && <ShareEvent event={event} url={`/calendar#${event._id}`} />}
          </div>
        </Cell>

        <Cell className={styles.focus}>
          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

          {!showGallery && (
            <FadePresence motionKey={event._id}>
              <CalendarShowcase
                className={styles.blur_spotlight}
                caption={<Text text={translate(event.thumbnail?.copyrightInternational)} />}
                medium={event.thumbnail}
              />
            </FadePresence>
          )}

          <Tags event={event} setShowGallery={setShowGallery} />
        </Cell>
      </Row>
    </div>
  );
});

const PinnedEvent = forwardRef(({ event }, ref) => {
  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      id={event._id}
      className={`${styles.pinnedEvent} ${styles.event} ${styles.noImage}`}
    >
      <Row>
        <Cell className={styles.textCell}>
          <Title event={event} />

          <EventDescription event={event} />
        </Cell>

        <Cell className={styles.focus}>
          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

          <Tags event={event} />
        </Cell>
      </Row>
    </div>
  );
});

export default Event;
