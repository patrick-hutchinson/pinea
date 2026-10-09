import { getPeriodicals } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";
import { getPeriodicalPath } from "@/lib/periodicals/periodicalSlug";

export default function PrintPeriodicalIndex() {
  return null;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const periodicals = await getPeriodicals();
  const newestPeriodical = Array.isArray(periodicals) ? periodicals[0] : null;

  if (newestPeriodical) {
    return {
      redirect: {
        destination: getPeriodicalPath(newestPeriodical, 0),
        permanent: false,
      },
    };
  }

  return {
    props: {
      periodicals: [],
    },
  };
});
