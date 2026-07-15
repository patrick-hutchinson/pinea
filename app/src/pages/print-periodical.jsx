import PrintPeriodicalPage from "@/views/print-periodical/PrintPeriodicalPage";
import { getPeriodicalPage, getPeriodicals, getSiteData } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function PrintPeriodical({ initialSelector, page, periodicals, site }) {
  return <PrintPeriodicalPage initialSelector={initialSelector} page={page} periodicals={periodicals} site={site} />;
}

export const getServerSideProps = withPagesShellProps(async ({ query }) => {
  const [page, periodicals, site] = await Promise.all([getPeriodicalPage(), getPeriodicals(), getSiteData()]);
  const selector = Array.isArray(query?.selector) ? query.selector[0] : query?.selector;

  return {
    props: {
      initialSelector: typeof selector === "string" ? selector : "",
      page,
      periodicals,
      site,
    },
  };
});
