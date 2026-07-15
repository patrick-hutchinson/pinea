import AboutPage from "@/views/about/AboutPage";
import { getAboutPage, getSiteData } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function About({ global, page }) {
  return <AboutPage global={global} page={page} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const [page, global] = await Promise.all([getAboutPage(), getSiteData()]);

  return {
    props: {
      page,
      global,
    },
  };
});
