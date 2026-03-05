import { getVisits, getPeople, getPortfolios, getPrintArticles, getReviews, getSpotOns } from "@/lib/fetch";
import ArchivePage from "./ArchivePage";

export default async function Page() {
  const visits = await getVisits();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();
  const print = await getPrintArticles();

  const peopleArticles = people.map((person) => ({
    ...person,
    title: person.archiveTitle,
    releaseInfo: {
      contributor: [{ name: person.name }],
      releaseDate: person.releaseDate,
    },
    category: "recommended",
  }));

  const articles = [...visits, ...portfolios, ...reviews, ...spotOn, ...peopleArticles, ...print];

  return <ArchivePage articles={articles} />;
}
