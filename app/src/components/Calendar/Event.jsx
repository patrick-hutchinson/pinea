"use client";

import styles from "./Calendar.module.css";
import FormatDate from "@/components/FormatDate";
import Label from "@/components/Label";
import BlurSpotlight from "@/components/BlurSpotlight";
import BlurMedia from "@/components/BlurMedia";
import Text from "@/components/Text";

import { downloadEvent } from "@/helpers/downloadEvent";
import Link from "next/link";
import Icon from "../Icon";

import Row from "./Row";
import Cell from "./Cell";

const Tags = ({ event }) => (
  <div className={styles.tags}>
    {event.recommendations && <Label className={styles.notice}>RECOMMENDED</Label>}
    {event.pinned && <Label className={styles.notice}>SELECTED BY PINEA</Label>}
    {event.gallery && <Icon path="/icons/gallery-button.svg" className={styles.icon} />}
  </div>
);

const Dates = ({ event }) => {
  const dateFormat = { day: "2-digit", month: "2-digit", year: "numeric" };

  return (
    <div>
      <FormatDate date={event.startDate} options={dateFormat} className={styles.startDate} />
      <span className={styles.dash}>–</span>
      <FormatDate date={event.endDate} options={dateFormat} className={styles.endDate} />
    </div>
  );
};

const Location = ({ event }) => (
  <div style={{ display: "flex", justifyContent: "space-between", zIndex: 2 }}>
    <div>{`${event.museum}, ${event.city} (${event.country.cca2})`}</div>

    <Icon path="/icons/add-button.svg" className={styles.icon} onClick={() => downloadEvent(event)} />
  </div>
);

const Title = ({ event }) => (
  <div>
    <span className={styles.artist}>{event.artist}</span>, <span className={styles.title}>{event.title}</span>
  </div>
);

export const PlainEvent = ({ event }) => {
  return (
    <Row>
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
  );
};

export const PineaEvent = ({ event }) => {
  const hasThumbnail = event.thumbnail;

  return (
    <Row className={hasThumbnail && styles.pinned}>
      <Cell className={styles.text_cell}>
        <Title event={event} />

        {event.pinnedText && <Text text={event.pinnedText} className={styles.pinnedText} typo="h3" />}
      </Cell>

      {hasThumbnail ? (
        <Cell className={styles.focus}>
          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

          <BlurSpotlight medium={event.thumbnail} className={styles.blurMedia} />

          <Tags event={event} />
        </Cell>
      ) : (
        <>
          <Cell>
            <Dates event={event} />
          </Cell>
          <Cell>
            <Location event={event} />
          </Cell>
        </>
      )}
    </Row>
  );
};

export const RecommendedEvent = ({ event }) => {
  return (
    <Row className={styles.recommended}>
      <Cell className={styles.text_cell}>
        <Title event={event} />
        <div>
          <i style={{ marginRight: "3px" }} typo="h3">
            {event.recommendations.voice.name},
          </i>
          <Text text={event.recommendations.teaser} className={styles.pinnedText} typo="h3" />
          {event.recommendations?.comment && (
            <Link href={`/voices/${event.recommendations.slug}`}>
              <span typo="h3">Read More</span>
            </Link>
          )}
        </div>
      </Cell>

      <Cell className={styles.focus}>
        <div className={styles.eventInfo}>
          <Dates event={event} />

          <Location event={event} />
        </div>

        {event.recommendations.thumbnail && <BlurMedia medium={event.recommendations.thumbnail} />}

        <Tags event={event} />
      </Cell>
    </Row>
  );
};
