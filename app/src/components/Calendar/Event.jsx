"use client";
import { useEffect, useRef } from "react";
import { forwardRef } from "react";

import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";

import ExpandShowcase from "@/components/Showcase/ExpandShowcase";

import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

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
import { StateContext } from "@/context/StateContext";

const Event = ({ event, index, array, setCurrentlyInView }) => {
  const { header_height, filter_height } = useContext(GlobalVariablesContext);

  // 🔗 Handle Hash Generation
  const router = useRouter();
  const ref = useRef(null);

  const isInView = useInView(ref, { margin: `${header_height + filter_height}px 0px -50% 0px` });

  useEffect(() => {
    if (isInView) {
      router.replace(`#${event._id}`, { scroll: false });
      setCurrentlyInView(event);
    }
  }, [isInView]);

  // Check if the event is in the past
  const now = new Date();
  const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;

  const eventIsOver = end ? end < now : false; // No date → treat as "not over"
  // Render Event
  return event.thumbnail && !eventIsOver ? (
    <ImageEvent event={event} index={index} array={array} ref={ref} />
  ) : event.recommendation ? (
    <RecommendedEvent event={event} index={index} array={array} ref={ref} />
  ) : (
    <PlainEvent event={event} index={index} array={array} ref={ref} />
  );
};

export const PlainEvent = forwardRef(({ event, index, array }, ref) => {
  const { isMobile } = useContext(StateContext);
  return (
    <div style={{ position: "relative" }} ref={ref} id={event._id} className={styles.plainEvent}>
      <Row className={index === array.length - 1 ? styles.last : ""}>
        <Cell>
          <Title event={event} />
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

const RecommendedEvent = forwardRef(({ event, index, array }, ref) => {
  const isLastRow = index === array.length - 1;

  return (
    <div style={{ position: "relative" }} ref={ref} id={event._id} className={styles.recommendedEvent}>
      <Row className={`${isLastRow ? styles.last : ""}`}>
        <Cell className={styles.text_cell}>
          <Title event={event} />

          <EventText event={event} />
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

const ImageEvent = forwardRef(({ event, index, array }, ref) => {
  const [showGallery, setShowGallery] = useState(false);
  const displayGallery = event.gallery && showGallery;

  const isLastRow = index === array.length - 1;

  return (
    <div
      style={{ position: "relative" }}
      ref={ref}
      id={event._id}
      className={`${styles.imageEvent} ${showGallery && styles.galleryIsVisible}`}
    >
      {displayGallery && (
        <FadePresence motionKey="gallery">
          <Gallery event={event} />
        </FadePresence>
      )}

      <Row className={`${isLastRow ? styles.last : ""}`}>
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
              <ExpandShowcase
                className={styles.blur_spotlight}
                // caption={translate(event.thumbnail?.copyrightIntl)}
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

export default Event;
