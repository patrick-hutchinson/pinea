import NotFoundPage from "@/components/NotFound/NotFoundPage";
import { getPictureBrush } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Custom404({ images }) {
  return <NotFoundPage images={images} />;
}

export const getStaticProps = withPagesShellProps(async () => {
  const pictureBrush = await getPictureBrush();

  return {
    props: {
      images: pictureBrush?.images || [],
    },
  };
});
