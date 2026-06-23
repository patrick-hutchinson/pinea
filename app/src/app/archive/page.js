import { getVisits, getPeople, getPortfolios, getPrintArticles, getReviews, getSpotOns } from "@/lib/fetch";
import ArchivePage from "./ArchivePage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [visits, portfolios, people, reviews, spotOn, print] = await Promise.all([
    getVisits(),
    getPortfolios(),
    getPeople(),
    getReviews(),
    getSpotOns(),
    getPrintArticles(),
  ]);

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
