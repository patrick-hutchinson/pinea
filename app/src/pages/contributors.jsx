import ContributorsPage from "@/views/contributors/ContributorsPage";
import { getContributors } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Contributors({ contributors }) {
  return <ContributorsPage contributors={contributors} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const contributors = await getContributors();

  return {
    props: {
      contributors,
    },
  };
});
