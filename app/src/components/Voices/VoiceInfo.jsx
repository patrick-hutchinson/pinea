import Text from "../Text";
import { PlainHead } from "../Calendar/Head";

import styles from "./Voices.module.css";

const VoiceInfo = ({ voice }) => {
  return (
    <div className={styles.info_container} typo="h4">
      <PlainHead>FACTS, FIGURES</PlainHead>
      <div className={styles.info_body}>
        <div className={styles.info_cell}>
          <div>{voice.name},</div>
          <div>{voice.role}</div>
          <div>
            {voice.socials?.map((social, index) => (
              <a key={index} href={social.link} target="_blank">
                {social.platform}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.info_cell}>
          <div>
            <Text text={voice.bio} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInfo;
