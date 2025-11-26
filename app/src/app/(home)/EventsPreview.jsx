import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Head } from "@/components/Calendar/Head";
import { PlainEvent } from "@/components/Calendar/Event";

import styles from "./HomePage.module.css";

const EventsPreview = ({ events }) => {
  const router = useRouter();

  const [shuffledEvents, setShuffledEvents] = useState([]);

  useEffect(() => {
    const now = new Date();

    const hosted = events.filter((event) => event.highlight?.hosted);
    const pinned = events.filter((event) => event.highlight?.pinned);

    const upcoming = events.filter((event) => new Date(event.endDate) >= now);
    const remaining = upcoming.filter((event) => !hosted.includes(event) && !pinned.includes(event));

    const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());

    // Combine and slice to max 5
    setShuffledEvents([...hosted, ...pinned, ...shuffledRemaining].slice(0, 5));
  }, [events]);

  return (
    <div className={styles.calendar} onClick={() => router.push("/calendar")} style={{ cursor: "pointer" }}>
      <Head />

      <ul typo="h4">
        {shuffledEvents.map((event, index, array) => {
          return <PlainEvent key={index} event={event} array={array} index={index} />;
        })}
      </ul>
    </div>
  );
};

export default EventsPreview;
