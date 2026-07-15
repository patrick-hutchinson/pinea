import PictureBrushTool from "@/app/pinsel/PictureBrushTool";
import { getPictureBrushTool } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Pinsel({ imageSets }) {
  return <PictureBrushTool imageSets={imageSets} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const pictureBrush = await getPictureBrushTool();

  return {
    props: {
      imageSets: pictureBrush?.imageSets ?? [],
    },
  };
});
