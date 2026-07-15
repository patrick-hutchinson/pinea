import NewsletterPage from "@/views/newsletter/[slug]/NewsletterPage";
import { getNewsletters, getSiteData } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Newsletter({ newsletter, site }) {
  return <NewsletterPage newsletter={newsletter} site={site} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params }) => {
  const slug = params?.slug;
  const [newsletters, site] = await Promise.all([getNewsletters(), getSiteData()]);
  const newsletter = newsletters.find((item) => item.slug?.current === slug);

  if (!newsletter) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsletter,
      site,
    },
  };
});
