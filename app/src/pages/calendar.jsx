import CalendarPage from "@/views/calendar/CalendarPage";
import { getCalendarPage, getCurrentCalendarEvents } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Calendar({ events, page }) {
  return <CalendarPage events={events} page={page} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const [events, page] = await Promise.all([getCurrentCalendarEvents(), getCalendarPage()]);

  return {
    props: {
      events,
      page,
    },
  };
});
