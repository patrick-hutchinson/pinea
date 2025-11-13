import { getPeople } from "@/lib/fetch";
import PeoplePage from "./PeoplePage";

export default async function Page() {
  const people = await getPeople();

  return <PeoplePage people={people} />;
}
