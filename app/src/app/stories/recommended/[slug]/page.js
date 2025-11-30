import { getPeople } from "@/lib/fetch";
import PersonPage from "./PersonPage";

export default async function Page({ params }) {
  const { slug } = params; // ✅ just destructure

  const people = await getPeople();

  const person = people.find((p) => p.slug.current === slug);

  return <PersonPage people={people} person={person} />;
}
