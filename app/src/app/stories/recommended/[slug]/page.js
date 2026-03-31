import { getPeople } from "@/lib/fetch";
import { notFound } from "next/navigation";
import PersonPage from "./PersonPage";

export default async function Page({ params }) {
  const { slug } = await params; // ✅ just destructure

  // const people = await getPeople();
  const [people] = await Promise.all([getPeople()]);

  const person = people.find((p) => p.slug.current === slug);
  if (!person) notFound();

  return <PersonPage people={people} person={person} />;
}
