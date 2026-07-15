import VisitsPage from "@/views/stories/visits/[slug]/VisitsPage";
import { getVisits } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Visit({ visit, visits }) {
  return <VisitsPage visit={visit} visits={visits} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params }) => {
  const visits = await getVisits();
  const visit = visits.find((item) => item.slug?.current === params?.slug);

  if (!visit) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      visit,
      visits,
    },
  };
});
