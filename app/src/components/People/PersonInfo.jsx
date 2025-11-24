import { PlainHead } from "../Calendar/Head";
import { LanguageContext } from "@/context/LanguageContext";

import styles from "./People.module.css";
import { useContext } from "react";

import PersonInfoBody from "./PersonInfoBody";

const PersonInfo = ({ person, className, articles, classNameCell }) => {
  let { language } = useContext(LanguageContext);

  return (
    <div className={`${styles.info_container} ${className}`} typo="h4">
      <PlainHead>{language === "en" ? "ABOUT" : "INFO"}</PlainHead>
      <PersonInfoBody person={person} articles={articles} classNameCell={classNameCell} />
    </div>
  );
};

export default PersonInfo;
