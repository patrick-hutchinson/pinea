import { getEvents } from "@/lib/fetch";

import CalendarPage from "./CalendarPage";

export default async function Page() {
  const [events] = await Promise.all([getEvents()]);

  return <CalendarPage events={events} />;
}
