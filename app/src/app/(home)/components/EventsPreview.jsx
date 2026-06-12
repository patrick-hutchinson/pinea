import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { Head } from "@/components/Calendar/Head";
import { PlainEvent } from "@/components/Calendar/Event";

import styles from "../HomePage.module.css";

const EventsPreview = ({ events }) => {
  const router = useRouter();

  const previewEvents = useMemo(() => {
    const now = new Date();
    const allEvents = events || [];
    const isUpcoming = (event) => {
      const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;
      return end ? end >= now : true;
    };

    const hosted = allEvents.filter((event) => event.highlight?.hosted && isUpcoming(event));
    const pinned = allEvents.filter((event) => event.highlight?.pinned);

    const upcoming = allEvents.filter(isUpcoming);
    const remaining = upcoming.filter((event) => !hosted.includes(event) && !pinned.includes(event));

    const deterministicRemaining = [...remaining].sort((a, b) => {
      const rankA = (a?._id || a?.slug?.current || "").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const rankB = (b?._id || b?.slug?.current || "").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      return rankA - rankB;
    });

    return [...hosted, ...pinned, ...deterministicRemaining].slice(0, 5);
  }, [events]);

  return (
    <div className={styles.calendar} onClick={() => router.push("/calendar")} style={{ cursor: "pointer" }}>
      <Head className={styles.previewHeader} />

      <ul typo="h4" style={{ pointerEvents: "none" }}>
        {previewEvents.map((event, index, array) => {
          return (
            <PlainEvent
              key={event?._id || event?.slug?.current || `${event?.title || "event"}-${index}`}
              event={event}
              array={array}
              index={index}
              showShare={false}
              className={styles.plainEvent}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default EventsPreview;
