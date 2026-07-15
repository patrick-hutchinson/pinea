import ReviewPage from "@/app/stories/reviews/[slug]/ReviewPage";
import { getReviews } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Review({ review, reviews }) {
  return <ReviewPage review={review} reviews={reviews} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params }) => {
  const reviews = await getReviews();
  const review = reviews.find((item) => item.slug?.current === params?.slug);

  if (!review) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      review,
      reviews,
    },
  };
});
