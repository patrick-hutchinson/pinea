import { translate } from "@/helpers/translate";

import Dates from "../Calendar/Event/Dates";

const CurrentEvent = ({ event }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(var(--margin) * 2)",
        textAlign: "center",
        left: "25%",
        transform: "translateX(-50%)",
      }}
      typo="h4"
    >
      <span>{translate(event.title)}</span>, <Dates event={event} />
      <span>
        <a href={event.location.url} target="_blank">
          {translate(event.location.museum)}
        </a>
      </span>
    </div>
  );
};

export default CurrentEvent;
