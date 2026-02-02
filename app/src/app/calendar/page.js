import { getEvents } from "@/lib/fetch";
import { getCalendarPage } from "@/lib/fetch";
import CalendarPage from "./CalendarPage";

export default async function Page() {
  const events = await getEvents();
  const page = await getCalendarPage();

  return <CalendarPage events={events} page={page} />;
}
