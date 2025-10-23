"use client";

import { useState } from "react";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";

import Recommendation from "@/components/Voices/Recommendation";
import CurrentEvent from "@/components/Voices/CurrentEvent";
import VoiceInfo from "@/components/Voices/VoiceInfo";

import styles from "./VoicePage.module.css";
import Label from "@/components/Label";

import { useRouter } from "next/navigation";

const VoicePage = ({ voices, voice }) => {
  const router = useRouter();

  const recommendations = voice.recommendations;

  const [currentEvent, setCurrentEvent] = useState(recommendations[0].event);
  const currentIndex = recommendations.findIndex((r) => r.event._id === currentEvent._id);

  const names = voices.filter((voice) => voice.name).map((voice) => voice.name);

  const handleFilter = (item) => {
    const voice = voices.find((voice) => voice.name === item);

    if (voice) {
      const slug = voice.slug.current;
      console.log("Navigating to:", slug);
      // For example, if you're using Next.js router:
      router.push(`/voices/${slug}`);
    }
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={names} handleFilter={handleFilter} />

      <section style={{ overflow: "visible" }}>
        <Label className={styles.counter}>{`${currentIndex + 1}/${recommendations.length} TIPS`}</Label>
        <MediaPair>
          <div>
            <ul>
              {voice.recommendations.map((rec) => (
                <Recommendation key={rec._id} recommendation={rec} setCurrentEvent={setCurrentEvent} />
              ))}
            </ul>
            <br />
            <VoiceInfo voice={voice} />
          </div>

          <div className={styles.portrait}>
            <Media medium={voice.thumbnail} />
          </div>
        </MediaPair>

        <CurrentEvent event={currentEvent} />
      </section>
    </main>
  );
};

export default VoicePage;
