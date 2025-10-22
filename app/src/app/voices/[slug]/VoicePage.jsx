"use client";

import Media from "@/components/Media/Media";
import styles from "./VoicePage.module.css";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text";

const VoicePage = ({ voices, voice }) => {
  console.log(voice, "voice");

  const names = voices.filter((voice) => voice.name).map((voice) => voice.name);

  const CurrentEvent = () => {
    return <div>Event Title</div>;
  };

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.voices_filter} array={names} />

      <section style={{ overflow: "visible" }}>
        <MediaPair>
          <ul>
            {voice.recommendations.map((recommendation) => {
              const text = recommendation.comment ? recommendation.comment : recommendation.teaser;
              return (
                <li className={styles.comment}>
                  <Text text={text} />
                </li>
              );
            })}
          </ul>
          <div style={{ position: "sticky", top: "10px", alignSelf: "start" }}>
            <Media medium={voice.thumbnail} />
          </div>
        </MediaPair>
        <CurrentEvent />
      </section>
    </main>
  );
};

export default VoicePage;
