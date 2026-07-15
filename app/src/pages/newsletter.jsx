import NewslettersPage from "@/app/newsletter/NewslettersPage";
import { getNewsletters } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Newsletters({ newsletters }) {
  return <NewslettersPage newsletters={newsletters} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const newsletters = await getNewsletters();

  return {
    props: {
      newsletters,
    },
  };
});
