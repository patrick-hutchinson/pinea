import CalendarPage from "@/views/calendar/CalendarPage";
import { getCalendarPage, getEvents } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Calendar({ events, page }) {
  return <CalendarPage events={events} page={page} />;
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
