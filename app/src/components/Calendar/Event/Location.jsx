import { downloadEvent } from "@/helpers/downloadEvent";
import DownloadButton from "@/components/Calendar/Event/DownloadButton";

const Location = ({ event }) => {
  const isUpcomingOrCurrent = !event.endDate || new Date(event.endDate) >= new Date();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", zIndex: 2 }}>
      <div>{`${event.museum}, ${event.city} (${event.country.cca2})`}</div>

      {isUpcomingOrCurrent && <DownloadButton onClick={() => downloadEvent(event)} />}
    </div>
  );
};

export default Location;
