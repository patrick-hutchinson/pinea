import CalendarArchivePage from "@/views/calendar-archive/CalendarArchivePage";
import { getCalendarPage, getEvents } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function CalendarArchive({ events, page }) {
  return <CalendarArchivePage events={events} page={page} />;
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
