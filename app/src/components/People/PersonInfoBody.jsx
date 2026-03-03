import styles from "./People.module.css";

import { translate } from "@/helpers/translate";

import Text from "@/components/Text/Text";

const PersonInfoBody = ({ person, articles, classNameCell, className }) => {
  return (
    <div className={`${className} ${styles.info_body}`} typo="h4">
      <div className={`${classNameCell} ${styles.info_cell}`}>
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
  );
};

export default PersonInfoBody;
