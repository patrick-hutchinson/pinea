import EditionsPage from "@/views/editions/EditionsPage";
import { getEditions, getEditionsPage } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Editions({ editions, initialSelector, page }) {
  return <EditionsPage editions={editions} initialSelector={initialSelector} site={page} />;
}

export const getServerSideProps = withPagesShellProps(async ({ query }) => {
  const [editions, page] = await Promise.all([getEditions(), getEditionsPage()]);
  const selector = Array.isArray(query?.selector) ? query.selector[0] : query?.selector;

  return {
    props: {
      editions,
      initialSelector: typeof selector === "string" ? selector : "",
      page,
    },
  };
});
