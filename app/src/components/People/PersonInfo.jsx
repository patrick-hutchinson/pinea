import Text from "../Text/Text";
import { translate } from "@/helpers/translate";
import { PlainHead } from "../Calendar/Head";
import { StateContext } from "@/context/StateContext";

import styles from "./People.module.css";
import { useContext } from "react";

const PersonInfo = ({ person, className, articles }) => {
  let { language } = useContext(StateContext);

  return (
    <div className={`${styles.info_container} ${className}`} typo="h4">
      <PlainHead>{language === "en" ? "ABOUT" : "INFO"}</PlainHead>
      <div className={styles.info_body}>
        <div className={styles.info_cell}>
          <div>{person.name}</div>
          <div>{translate(person.role)}</div>
          <div style={{ marginTop: "var(--margin)", display: "flex", flexDirection: "column" }}>
            {person.socials?.map((social, index) => (
              <a className={styles.social} key={index} href={social.link} target="_blank">
                {translate(social.platform)}
              </a>
            ))}
            {articles && articles}
          </div>
        </div>
        <div className={styles.info_cell}>
          <div>
            <Text text={translate(person.bio)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonInfo;
