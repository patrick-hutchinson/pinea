import ArchivePage from "@/views/archive/ArchivePage";
import { getPeople, getPortfolios, getPrintArticles, getReviews, getSpotOns, getVisits } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

const getArchiveArticles = async () => {
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

  return [...visits, ...portfolios, ...reviews, ...spotOn, ...peopleArticles, ...print];
};

export default function Archive({ articles }) {
  return <ArchivePage articles={articles} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const articles = await getArchiveArticles();

  return {
    props: {
      articles,
    },
  };
});
