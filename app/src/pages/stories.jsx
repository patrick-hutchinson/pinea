import StoriesPage from "@/views/stories/StoriesPage";
import { getPeople, getPortfolios, getReviews, getSpotOns, getVisits } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

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

export default function Stories({ data }) {
  return <StoriesPage data={data} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const [visits, portfolios, people, reviews, spotOn] = await Promise.all([
    getVisits(),
    getPortfolios(),
    getPeople(),
    getReviews(),
    getSpotOns(),
  ]);

  const data = [
    ...sortByDateDesc(visits),
    ...sortByDateDesc(portfolios),
    ...sortByDateDesc(reviews),
    ...sortByDateDesc(spotOn),
    ...sortByDateDesc(people),
  ];

  return {
    props: {
      data,
    },
  };
});
