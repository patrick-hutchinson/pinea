import { getEvents } from "@/lib/fetch";
// import { localizeEvents } from "@/lib/i18n";
import CalendarPage from "./CalendarPage";

export default async function Page({ params }) {
  // const lang = params.lang; // 'en' or 'de'
  const events = await getEvents();
  // const localizedEvents = localizeEvents(events, lang);

  return <CalendarPage events={events} />;
}
