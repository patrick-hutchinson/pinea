import { downloadEvent } from "@/helpers/downloadEvent";
import { translate } from "@/helpers/translate";

import AddButton from "@/components/Buttons/AddButton";
import ShareButton from "@/components/Buttons/ShareButton";

import styles from "../Calendar.module.css";

const ShareEvent = ({ event, slug }) => {
  const translatedTitle = translate(event.title);
  const translatedArtist = translate(event.artist);

  return (
    <div style={{ display: "flex", gap: "3px" }} className={styles.shareIcons}>
      <AddButton onClick={() => downloadEvent(event, translatedArtist, translatedTitle)} />
      <ShareButton slug={slug} />
    </div>
  );
};

export default ShareEvent;
