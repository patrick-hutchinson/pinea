import { getVisits, getPortfolios, getPeople, getReviews, getSpotOns } from "@/lib/fetch";
import StoriesPage from "./StoriesPage";

export default async function Page() {
  const visits = await getVisits();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();

  const getDateValue = (item) => {
    const rawDate = item?.releaseInfo?.releaseDate || item?.releaseDate;
    if (!rawDate) return Number.NEGATIVE_INFINITY;
    const timestamp = new Date(rawDate).getTime();
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
  };

  const sortByDateDesc = (items = []) =>
    [...items]
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const diff = getDateValue(b.item) - getDateValue(a.item);
        if (diff !== 0) return diff;
        return a.index - b.index;
      })
      .map(({ item }) => item);

  const data = [
    ...sortByDateDesc(visits),
    ...sortByDateDesc(portfolios),
    ...sortByDateDesc(reviews),
    ...sortByDateDesc(spotOn),
    ...sortByDateDesc(people),
  ];

  return <StoriesPage data={data} />;
}
