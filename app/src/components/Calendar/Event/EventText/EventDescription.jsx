import styles from "../../Calendar.module.css";

import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";
import { StateContext } from "@/context/StateContext";
import { useContext } from "react";

const EventDescription = ({ event }) => {
  const { isMobile } = useContext(StateContext);

  const pinnedText = isMobile
    ? (event.hostedText_mobile ?? event.hostedText)
    : (event.hostedText ?? event.hostedText_mobile);

  return (
    <>
      <Text text={translate(pinnedText)} className={styles.pinnedText} typo="h3" />
    </>
  );
};

export default EventDescription;
