import { getEvents } from "@/lib/fetch";
import { getCalendarPage } from "@/lib/fetch";
import CalendarArchivePage from "./CalendarArchivePage";

export default async function Page() {
  const events = await getEvents();
  const page = await getCalendarPage();

  return <CalendarArchivePage events={events} page={page} />;
}
