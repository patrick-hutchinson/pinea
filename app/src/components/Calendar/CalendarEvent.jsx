"use client";

import styles from "./Calendar.module.css";
import FormatDate from "@/components/FormatDate";
import Notice from "@/components/Notice";
import BlurMedia from "@/components/BlurMedia";
import BlurPlaceholder from "@/components/BlurPlaceholder";
import Text from "@/components/Text";

import { downloadEvent } from "@/helpers/downloadEvent";
import Link from "next/link";
import Icon from "../Icon";

const dateFormat = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

const Row = ({ children, className = "" }) => <li className={`${styles.row} ${className}`}>{children}</li>;

const Cell = ({ children, className = "" }) => <div className={`${styles.cell} ${className}`}>{children}</div>;

const Tags = ({ event }) => (
  <div className={styles.tags}>
    {event.recommendations && <Notice className={styles.notice}>RECOMMENDED</Notice>}
    {event.pinned && <Notice className={styles.notice}>SELECTED BY PINEA</Notice>}
    {event.gallery && <Icon path="/icons/gallery-button.svg" className={styles.icon} />}
  </div>
);

const Dates = ({ event }) => (
  <div>
    <FormatDate date={event.startDate} options={dateFormat} className={styles.startDate} />
    <span className={styles.dash}>–</span>
    <FormatDate date={event.endDate} options={dateFormat} className={styles.endDate} />
  </div>
);

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

        {event.pinnedText && <Text text={event.pinnedText} className={styles.pinnedText} />}
      </Cell>

      {hasThumbnail ? (
        <Cell className={styles.focus}>
          <div className={styles.eventInfo}>
            <Dates event={event} />

            <Location event={event} />
          </div>

          <BlurMedia medium={event.thumbnail} className={styles.blurMedia} />

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
          <i>{event.recommendations.voice.name}</i>,
          <Text text={event.recommendations.teaser} className={styles.pinnedText} />
          {event.recommendations?.comment && (
            <span>
              <Link href={`/voices/${event.recommendations.slug}`}>Read More</Link>
            </span>
          )}
        </div>
      </Cell>

      <Cell className={styles.focus}>
        <div className={styles.eventInfo}>
          <Dates event={event} />

          <Location event={event} />
        </div>

        {event.recommendations.thumbnail && <BlurPlaceholder source="/images/blur_placeholder.jpg" />}

        <Tags event={event} />
      </Cell>
    </Row>
  );
};
