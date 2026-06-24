import { getEvents } from "@/lib/fetch";
import { getCalendarPage } from "@/lib/fetch";
import PineaEvents from "./PineaEvents";

export default async function Page() {
  const events = await getEvents();
  const page = await getCalendarPage();

  return <PineaEvents events={events} page={page} />;
}
