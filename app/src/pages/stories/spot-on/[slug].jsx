import SpotOnPage from "@/views/stories/spot-on/[slug]/SpotOnPage";
import { getSpotOns } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function SpotOn({ spotOn, spotOns }) {
  return <SpotOnPage spotOn={spotOn} spotOns={spotOns} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params }) => {
  const spotOns = await getSpotOns();
  const spotOn = spotOns.find((item) => item.slug?.current === params?.slug);

  if (!spotOn) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      spotOn,
      spotOns,
    },
  };
});
