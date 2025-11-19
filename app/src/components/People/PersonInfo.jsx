import Text from "../Text/Text";
import { translate } from "@/helpers/translate";
import { PlainHead } from "../Calendar/Head";

import styles from "./People.module.css";

const PersonInfo = ({ person, className }) => {
  return (
    <div className={`${styles.info_container} ${className}`} typo="h4">
      <PlainHead>FACTS, FIGURES</PlainHead>
      <div className={styles.info_body}>
        <div className={styles.info_cell}>
          <div>{person.name}</div>
          <div>{translate(person.role)}</div>
          <div>
            {person.socials?.map((social, index) => (
              <a key={index} href={social.link} target="_blank">
                {social.platform}
              </a>
            ))}
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
