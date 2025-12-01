"use client";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate/FormatDate";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";

import Text from "@/components/Text/Text";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import Label from "@/components/Label/Label";

import MicroFooter from "@/components/Footer/MicroFooter";

import { translate } from "@/helpers/translate";
import { countFootnotes } from "@/helpers/countFootnotes";

import styles from "./VisitsPage.module.css";
import CoverMedia from "@/components/CoverMedia/CoverMedia";
import Longcopy from "@/components/Longcopy/Longcopy";
import StickyArticleImage from "@/components/ArticleImage/StickyArticleImage";
import LayoutSwitcher from "../../../../components/Stories/LayoutSwitcher";

const VisitsPage = ({ interview, interviews }) => {
  const { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);
  const text = translate(interview.text);

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const allFootnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  const secondHalfOffset = countFootnotes(firstHalf, allFootnotes);

  const InterviewTitle = () => {
    return (
      <div className={styles.title}>
        <h4>
          <Text text={translate(interview.title)} />
        </h4>
        {interview.speakers.map((speaker, index) => {
          return (
            <h2 className={styles.speaker} key={index}>
              {speaker.name}
            </h2>
          );
        })}
        {interview.author.map((author, index) => {
          return (
            <h4 key={index}>
              {language === "en" ? "by" : "von"} {author.name}, <FormatDate date={interview.releaseDate} />
            </h4>
          );
        })}
      </div>
    );
  };

  return <LayoutSwitcher story={interview} stories={interviews} />;
};

export default VisitsPage;
