import PineaEvents from "@/views/pinea-events/PineaEvents";
import { getCalendarPage, getEvents } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function PineaEventsPage({ events, page }) {
  return <PineaEvents events={events} page={page} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const [events, page] = await Promise.all([getEvents(), getCalendarPage()]);

  return {
    props: {
      events,
      page,
    },
  };
});
