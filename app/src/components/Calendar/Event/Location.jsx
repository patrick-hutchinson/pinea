import styles from "../Calendar.module.css";

import { downloadEvent } from "@/helpers/downloadEvent";

import Icon from "@/components/Icon";

const Location = ({ event }) => (
  <div style={{ display: "flex", justifyContent: "space-between", zIndex: 2 }}>
    <div>{`${event.museum}, ${event.city} (${event.country.cca2})`}</div>

    <Icon path="/icons/add-button.svg" className={styles.icon} onClick={() => downloadEvent(event)} />
  </div>
);

export default Location;
