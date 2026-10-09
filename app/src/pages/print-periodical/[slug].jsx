import PrintPeriodicalPage from "@/views/print-periodical/PrintPeriodicalPage";
import { getPeriodicalPage, getPeriodicals, getSiteData } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";
import { getPeriodicalSlug } from "@/lib/periodicals/periodicalSlug";

export default function PrintPeriodicalIssue({ page, periodical, periodicals, site }) {
  return <PrintPeriodicalPage page={page} periodical={periodical} periodicals={periodicals} site={site} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params }) => {
  const [page, periodicals, site] = await Promise.all([getPeriodicalPage(), getPeriodicals(), getSiteData()]);
  const requestedSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const safePeriodicals = Array.isArray(periodicals) ? periodicals : [];
  const periodical = safePeriodicals.find((item, index) => getPeriodicalSlug(item, index) === requestedSlug);

  if (!periodical) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      periodical,
      periodicals: safePeriodicals,
      site,
    },
  };
});
