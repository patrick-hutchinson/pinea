import { getVisits, getPortfolios, getPeople, getReviews, getSpotOns } from "@/lib/fetch";
import StoriesPage from "./StoriesPage";

const getStoryTimestamp = (item) => {
  const dateValue = item?.releaseInfo?.releaseDate || item?.releaseDate;
  const ts = dateValue ? new Date(dateValue).getTime() : NaN;
  return Number.isFinite(ts) ? ts : -Infinity;
};

export default async function Page() {
  const visits = await getVisits();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();

  const data = [...visits, ...portfolios, ...reviews, ...spotOn, ...people].sort(
    (a, b) => getStoryTimestamp(b) - getStoryTimestamp(a),
  );

  return <StoriesPage data={data} />;
}
