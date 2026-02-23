import { getInterviews, getPeople, getPortfolios, getPrintArticles, getReviews, getSpotOns } from "@/lib/fetch";
import IndexPage from "./IndexPage";

export default async function Page() {
  const interviews = await getInterviews();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();
  const print = await getPrintArticles();

  const voices = people.map((person) => ({
    ...person,
    title: person.archiveTitle,
    author: person.name,
    category: "recommended",
  }));

  const articles = [...interviews, ...portfolios, ...reviews, ...spotOn, ...voices, ...print];

  return <IndexPage articles={articles} />;
}
