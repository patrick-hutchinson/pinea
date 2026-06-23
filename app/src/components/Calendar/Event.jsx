"use client";
import { useEffect, useRef } from "react";
import { forwardRef } from "react";

import { AnimatePresence, motion, useInView } from "framer-motion";

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

const Event = ({ event, setCurrentlyInView, renderMode }) => {
  // 🔗 Handle Hash Generation
  const ref = useRef(null);

  const hasThumbnail = event.thumbnail && event.thumbnail.mediaType !== "none";
  const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;

  if (renderMode === "plain" && event.recommendation) {
    return (
      <RecommendedEvent
        event={event}
        ref={ref}
        showMedia={false}
        showBlurOnlyFallback={true}
      />
    );
  }

  if (renderMode === "plain") {
    return <PlainEvent event={event} ref={ref} showShare={true} />;
  }

  // Render Event
  return event.recommendation ? (
    <RecommendedEvent event={event} ref={ref} />
  ) : hasThumbnail || hasGallery ? (
    <ImageEvent event={event} ref={ref} />
  ) : event.highlight?.pinned ? (
    <PinnedEvent event={event} ref={ref} />
  ) : (
    <PlainEvent event={event} ref={ref} showShare={true} />
  );
};

const hasUsableMedium = (medium) => Boolean(medium && medium.mediaType !== "none");

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

const RecommendedEvent = forwardRef(({ event, showMedia = true, showBlurOnlyFallback = false }, ref) => {
  const { isMobile } = useContext(StateContext);
  const showcaseMedium = hasUsableMedium(event.recommendation?.thumbnail)
    ? event.recommendation.thumbnail
    : event.thumbnail;
  const hasImage = showMedia && hasUsableMedium(showcaseMedium);
  const hasBlurOnlyFallback = Boolean(!hasImage && showBlurOnlyFallback && hasUsableMedium(showcaseMedium));

  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      id={event._id}
      className={`${styles.event} ${styles.recommendedEvent} ${(hasImage || hasBlurOnlyFallback) && styles.hasImage}`}
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

          {hasImage && (
            <CalendarShowcase
              className={styles.blur_spotlight}
              caption={<Text text={translate(showcaseMedium?.copyrightInternational)} />}
              medium={showcaseMedium}
            />
          )}
          {hasBlurOnlyFallback ? (
            <CalendarShowcase
              className={styles.blur_spotlight}
              caption={<Text text={translate(showcaseMedium?.copyrightInternational)} />}
              medium={showcaseMedium}
              showForeground={false}
            />
          ) : null}

          <Tags event={event} />
        </Cell>
      </Row>
    </div>
  );
});

const ImageEvent = forwardRef(({ event }, ref) => {
  const [showGallery, setShowGallery] = useState(false);
  const hasThumbnail = event.thumbnail && event.thumbnail.mediaType !== "none";
  const hasGallery = Array.isArray(event.gallery) && event.gallery.length > 0;
  const displayGallery = hasGallery && showGallery;

  const { isMobile } = useContext(StateContext);
  const mediaTransition = { duration: 0.45, ease: "easeInOut" };

  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      id={event._id}
      className={`${styles.hasImage} ${styles.event} ${showGallery && styles.galleryIsVisible}`}
    >
      <AnimatePresence initial={false}>
        {displayGallery ? (
          <motion.div
            key="gallery"
            className={styles.galleryCrossfadeLayer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={mediaTransition}
          >
            <Gallery event={event} />
          </motion.div>
        ) : null}
      </AnimatePresence>

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
          <div className={styles.mediaCrossfadeLayer}>
            <AnimatePresence initial={false}>
              {!showGallery && hasThumbnail ? (
                <motion.div
                  key="showcase"
                  className={styles.mediaCrossfadeItem}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={mediaTransition}
                >
                  <CalendarShowcase
                    className={styles.blur_spotlight}
                    caption={<Text text={translate(event.thumbnail?.copyrightInternational)} />}
                    medium={event.thumbnail}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

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
