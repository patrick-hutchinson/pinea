import { getEvents } from "@/lib/fetch";
import PineaEvents from "./PineaEvents";

export default async function Page() {
  const events = await getEvents();

  return <PineaEvents events={events} />;
}
