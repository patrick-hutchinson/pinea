import ArchivePage from "@/views/archive/ArchivePage";
import { getMembershipSessionFromRequest } from "@/lib/auth/membershipSession";
import {
  canDownloadArchiveItem,
  getMostRecentDownloadableReleaseTimestamp,
} from "@/lib/auth/archiveDownloadAccess";
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

export const getServerSideProps = withPagesShellProps(async ({ req }) => {
  const articles = await getArchiveArticles();
  const membershipSession = await getMembershipSessionFromRequest(req);
  const mostRecentDownloadableReleaseTimestamp = getMostRecentDownloadableReleaseTimestamp(articles);
  const articlesWithDownloadAccess = articles.map((article) => ({
    ...article,
    canDownloadPDF: canDownloadArchiveItem({
      item: article,
      membershipSession,
      mostRecentDownloadableReleaseTimestamp,
    }),
  }));

  return {
    props: {
      articles: articlesWithDownloadAccess,
    },
  };
});
